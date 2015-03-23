function createEngine(root, width, height){
    var engine = (function (root, width, height) {

        // Main export object, every method and property attached to this object
        // will be accessible by caller.
        var _exports = {};

        // Private variables.
        var _lastUpdateTime = new Date().getTime();

        // Private constants.
        var _constants = {
            movedirNone: (0<<0),
            movedirLeft: (1<<0),
            movedirRight: (1<<1),

            shipSpeed: 0.8,
            projectileSpeed: 0.8,

            playerShipWidth: 50, // TODO: Make depend on actual player ship width.
            playerShipHeight: 50 // TODO: Make depend on actual player ship height.
        };

        var _player = {
            lives: 3,
            position: {},
            moveDir: 0
        };

        _player.position.x = 0;
        _player.position.y = 0;

        var _projectiles = [];
        var _enemyShips = [];

        var _sprite;
        var _component;

        var _score = 0;

        var _width = width;
        var _height = height;
        var _root = root;

        _player.position.x = (_width/2)-(_constants.playerShipWidth/2);

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
        }

        // Access level: Public
        // Description: Get the current score.
        // Returns: score as integer.
        _exports.score = function() {
            return _score;
        }

        // Access level: Public
        // Description: Reset score counter.
        // Returns: -
        _exports.resetScore = function() {
            _score = 0;
        }

        // Access level: Public
        _exports.player = _player;

        // Access level: Public
        // Description: Inject key down events
        _exports.keyDown = function(event){
            if(event.key === Qt.Key_Left){
                if(!event.isAutoRepeat){
                    _player.moveDir |= _constants.movedirLeft;
                }

                event.accepted = true;
            }
            if(event.key === Qt.Key_Right){
                if(!event.isAutoRepeat){
                    _player.moveDir |= _constants.movedirRight;
                }

                event.accepted = true;
            }
        }

        // Access level: Public
        // Description: Inject key up events
        _exports.keyUp = function(event){
            if(event.key === Qt.Key_Left){
                if(!event.isAutoRepeat){
                    _player.moveDir &= ~(_constants.movedirLeft);
                }
            }

            if(event.key === Qt.Key_Right){
                if(!event.isAutoRepeat){
                    _player.moveDir &= ~(_constants.movedirRight);
                }
            }

            if(event.key === Qt.Key_Space){
                if(!event.isAutoRepeat){
                    var objectName = "playerProjectile";
                    var projectileStartX = _player.x + (_constants.playerShipWidth/2);
                    var projectileStartY = _height - (_constants.playerShipHeight+30);
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
            if(_player.moveDir === _constants.movedirLeft){
                // Make sure player does not go out of bounds and move the ship to new position.
                _player.position.x = Math.max(0, _player.position.x - (_constants.shipSpeed * dT));
            } else if(_player.moveDir === _constants.movedirRight){
                // Make sure player does not go out of bounds and move the ship to new position.
                _player.position.x = Math.min(_width-_constants.playerShipWidth, _player.position.x + (_constants.shipSpeed * dT));
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
                            _score += 10;

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
                    _projectiles[i].y = Math.max(0, _projectiles[i].y - (_constants.projectileSpeed * dT));
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
                    console.log("info: Created object " + shipType);
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

            _player.position.x = (width/2)-(_constants.playerShipWidth/2);

            _score = 0;
        }


        return _exports;
    }());

    return engine;
}

