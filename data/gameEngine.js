// Constants
var MOVEDIR_NONE    = (0<<0);
var MOVEDIR_LEFT    = (1<<0);
var MOVEDIR_RIGHT   = (1<<1);
var SHIP_SPEED      = 0.8;
var PROJECTILE_SPEED    = 0.8;
var PLAYERSHIP_WIDTH    = 50; // TODO: Make depend on actual player ship width.
var PLAYERSHIP_HEIGHT   = 50; // TODO: Make depend on actual player ship height.

function createEngine(root, width, height){
    var engine = (function (root, width, height) {

        // Main export object, every method and property attached to this object
        // will be accessible by caller.
        var _exports = {};

        // Private variables.
        var _lastUpdateTime = new Date().getTime();

        var _projectiles = [];
        var _enemyShips = [];

        var _sprite, _component;

        var _width = width;
        var _height = height;
        var _root = root;

        var _score = createScore(0);
        var _player = createPlayer(0, 0, 3);

        console.log("_player.position.x: " + _player.getPosition().x);

        _exports.setWidth = function(width){
            _width = width;
            console.log("new width: " + _width);
        }

        _exports.setHeight = function(height){
            _height = height;
            console.log("new height: " + _height);
        }

        // Access level: Public
        // Description: Initialize a new game
        // Returns: -
        _exports.newGame = function(){
            createEnemyShips();
            _player.setPosition((_width/2)-(PLAYERSHIP_WIDTH/2), _height);
            _player.setLives(3);
        }

        // Access level: Public
        // Description: Get the current score.
        // Returns: score as integer.
        _exports.score = _score;

         // Access level: Public
        _exports.player = _player;

        // Access level: Public
        // Description: Inject key down events
        _exports.keyDown = function(event){
            if(event.key === Qt.Key_Left){
                if(!event.isAutoRepeat){
                    _player.moveDir |= MOVEDIR_LEFT;
                }

                event.accepted = true;
            }
            if(event.key === Qt.Key_Right){
                if(!event.isAutoRepeat){
                    _player.moveDir |= MOVEDIR_RIGHT;
                }

                event.accepted = true;
            }
        }

        // Access level: Public
        // Description: Inject key up events
        _exports.keyUp = function(event){
            if(event.key === Qt.Key_Left){
                if(!event.isAutoRepeat){
                    _player.moveDir &= ~(MOVEDIR_LEFT);
                }
            }

            if(event.key === Qt.Key_Right){
                if(!event.isAutoRepeat){
                    _player.moveDir &= ~(MOVEDIR_RIGHT);
                }
            }

            if(event.key === Qt.Key_Space){
                if(!event.isAutoRepeat){
                    var objectName = "playerProjectile";
                    var projectileStartX = _player.getPosition().x + (PLAYERSHIP_WIDTH/2);
                    var projectileStartY = _height - (PLAYERSHIP_HEIGHT+30);
                    var completedCallback = function(newObject) {
                        if(newObject) {
                            _projectiles.push(newObject);
                        } else {
                            console.log("error creating object" + objectName);
                        }
                    }

                    createObject( objectName,
                                 { x: projectileStartX, y: projectileStartY },
                                 _root, // object parent
                                 completedCallback );
                }
            }
        }

        // Access level: Public
        // Description: Update the game engine one tick.
        _exports.update = function () {
            var currentTime = new Date().getTime();
            var dT = (currentTime - _lastUpdateTime);

            // Move player ship.
            if(_player.moveDir === MOVEDIR_LEFT){
                // Make sure player does not go out of bounds and move the ship to new position.
                _player.setX(Math.max(0, _player.getPosition().x - (SHIP_SPEED * dT)));
            } else if(_player.moveDir === MOVEDIR_RIGHT){
                // Make sure player does not go out of bounds and move the ship to new position.
                _player.setX(Math.min(_width-PLAYERSHIP_WIDTH, _player.getPosition().x + (SHIP_SPEED * dT)));
            }

            // Update player projectiles
            for(var i=(_projectiles.length-1); i>=0; --i){

                var projectileDeleted = false;
                for(var j=0; j< _enemyShips.length; ++j){
                    if(_enemyShips[j].opacity !== 0){

                        //console.log("testing enemy ship " + j + " against projectile " + i);
                        var box1 = _projectiles[i].physicsBody;
                        var box2 = _enemyShips[j].physicsBody;

                        var collides = box1.testCollision(box2);
                        if(collides){
                            //console.log(" - enemy ship " + j + " collides with projectile " + i);
                            _enemyShips[j].opacity = 0;
                            _enemyShips[j].lastCollision = currentTime;

                            // update score.
                            _score.setScore(_score.getScore()+10);

                            // destroy qml object.
                            _projectiles[i].destroy();

                            // remove this projectile reference from the collection.
                            _projectiles.splice(i, 1);

                            projectileDeleted = true;
                            break;
                        }
                    }
                }

                if(projectileDeleted === false){
                    _projectiles[i].y = Math.max(0, _projectiles[i].y - (PROJECTILE_SPEED * dT));
                }
            }

            // Remove all projectiles that have a y value under 5 (y=0 is top of screen).
            _projectiles = _projectiles.filter( function(value, index, array) {
                if(value.y <= 5){
                    value.destroy();
                }

                return value.y > 5;
            } );

            _lastUpdateTime = new Date().getTime();
        };

        // Access level: Private
        // Description: Create a QML component.
        // @param object Type of object to create.
        // @param params Parameters to set at construction time for object.
        // @param parent Parent object.
        // @param completedCallback callback that will be called with instance reference when creation is complete.
        var createObject = function(object, params, parent, completedCallback) {
            if(object === "playerProjectile"){
                _component = Qt.createComponent("PlayerProjectile.qml");
            }
            else if(object === "enemyShip1"){
                _component = Qt.createComponent("EnemyShip1.qml");
            }
            else if(object === "enemyShip2"){
                _component = Qt.createComponent("EnemyShip2.qml");
            }
            else if(object === "enemyShip3"){
                _component = Qt.createComponent("EnemyShip3.qml");
            }

            if (_component.status === Component.Ready)
                finishCreation(parent, params, completedCallback);
            else
                _component.statusChanged.connect(finishCreation(parent, params, completedCallback));
        };

        // Access level: Private
        // Description: Create a qml object instance.
        var finishCreation = function(parent, params, completedCallback) {
            if (_component.status === Component.Ready) {
                _sprite = _component.createObject(parent, params);
                if(_sprite === null) {
                    // Error Handling
                    console.log("Error creating object");
                    completedCallback(null);
                }
                completedCallback(_sprite);
            } else if (_component.status === Component.Error) {
                // Error Handling
                console.log("Error loading _component:", _component.errorString());
                completedCallback(null);
            }
        }

        // Access level: Private
        // Description: Create a single enemy ship at specified position.
        var createEnemyShip = function(shipType, posX, posY) {
            var completedCallback = function(newObject) {
                if(newObject) {
                    //console.log("info: Created object " + shipType);
                    _enemyShips.push(newObject);
                } else {
                    console.log("ERROR: Error creating object " + shipType);
                }


            }

            createObject(shipType, { x: posX, y: posY }, root, completedCallback);
        }

        // Access level: Private
        // Description: Create all enemy ships for a new game.
        var createEnemyShips = function() {
            for(var x=0; x< 500; x+=50){
                for(var y=100; y< 400; y+=50){
                    createEnemyShip("enemyShip1", x + 50, y);
                }
            }
        }

        // Access level: Public
        // Description: Clear the game data.
        _exports.clearGameData = function(){

            for(var i=0; i< _projectiles.length; ++i){
                _projectiles[i].destroy();
            }
            _projectiles = [];

            for(var j=0; j< _enemyShips.length; ++j){
                _enemyShips[j].destroy();
            }
            _enemyShips = [];

            _score.setScore(0);
        }


        return _exports;
    }(root, width, height));

    return engine;
}


function createPlayer(initialX, initialY, lives){
    var player = (function(initialX, initialY, lives){

        var _exports = {};
        var _position = { _x: initialX, _y: initialY };
        var _lives = lives;
        var _positionObservers = [];

        _exports.moveDir = MOVEDIR_NONE;

        _exports.setPosition = function(x, y){
            _position._x = x;
            _position._y = y;

            for(var i=0; i< _positionObservers.length; ++i){
                _positionObservers[i]({ x: _position._x, y: _position._y });
            }
        }

        _exports.setX = function(x){
            _position._x = x;
            for(var i=0; i< _positionObservers.length; ++i){
                _positionObservers[i]({ x: _position._x, y: _position._y });
            }
        }

        _exports.setY = function(y){
            _position._y = y;
            for(var i=0; i< _positionObservers.length; ++i){
                _positionObservers[i]({ x: _position._x, y: _position._y });
            }
        }

        // Return a copy of the position object so
        // that the original can not be modified.
        _exports.getPosition = function(){
            return { x: _position._x, y: _position._y };
        }

        _exports.setLives = function(lives){
            _lives = lives;
        }

        _exports.registerPositionObserver = function(observer){
            _positionObservers.push(observer);
        }

        _exports.clearPositionObservers = function(observer){
           _positionObservers = [];
        }

        return _exports;
    }(initialX, initialY, lives));

    return player;
};


function createScore(initialScore){
    var score = (function(initialScore){
        var _exports = {};
        var _score = initialScore;
        var _scoreObservers = []

        _exports.getScore = function(){
            return _score;
        }

        _exports.setScore = function(score){
            _score = score;
            for(var i=0; i< _scoreObservers.length; ++i){
                _scoreObservers[i](_score);
            }
        }

        _exports.registerScoreObserver = function(observer){
            _scoreObservers.push(observer);
        }

        _exports.clearObservers = function(){
            _scoreObservers = [];
        }

        return _exports;

    }(initialScore));

    return score;
}
