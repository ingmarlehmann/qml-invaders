.import "player.js" as Player
.import "score.js" as Score
.import "constants.js" as Constants
.import "pubsub.js" as PS

function createEngine(root, width, height){
    var engine = (function (root, width, height) {

        // Main export object, every method and property attached to this object
        // will be accessible by caller.
        var _exports = {};

        // ----------------
        // Private variables
        // ----------------

        var _lastUpdateTime = new Date().getTime();

        var _playerProjectiles = [];
        var _enemyProjectiles = [];
        var _enemyShips = [];

        var _width = width;
        var _height = height;
        var _root = root;

        var _score = Score.createScore(0);
        var _player = Player.createPlayer(0, 0, 3);
        var _objectFactory = null;

        // ----------------
        // Public variables
        // ----------------

        // Access level: Public
        // Description: Score object
        _exports.score = _score;

        // Access level: Public
        // Description: Player object
        _exports.player = _player;


        // ----------------
        // Public methods
        // ----------------

        // Access level: Public
        // Description: Set a reference to the object factory instance.
        // Returns: nothing
        _exports.setObjectFactory = function(factory){
            _objectFactory = factory;
        }

        // Access level: Public
        // Description: Set the content area width for the game engine.
        // Returns: nothing
        _exports.setWidth = function(width){
            _width = width;
            //console.log("new width: " + _width);
        }

        // Access level: Public
        // Description: Set the content area height for the game engine.
        // Returns: nothing
        _exports.setHeight = function(height){
            _height = height;
            //console.log("new height: " + _height);
        }

        // Access level: Public
        // Description: Initialize a new game
        // Returns: nothing
        _exports.newGame = function(){
            createEnemyShips();
            _player.setPosition((_width/2)-(Constants.PLAYERSHIP_WIDTH/2), _height);
            _player.setLives(3);
        }

        // Access level: Public
        // Description: Method to inject key _down_ events
        _exports.keyDown = function(event){
            if(event.key === Qt.Key_Left){
                if(!event.isAutoRepeat){
                    _player.moveDir |= Constants.MOVEDIR_LEFT;
                }

                event.accepted = true;
            }
            if(event.key === Qt.Key_Right){
                if(!event.isAutoRepeat){
                    _player.moveDir |= Constants.MOVEDIR_RIGHT;
                }

                event.accepted = true;
            }
        }

        // Access level: Public
        // Description: Method to inject key _up_ events
        _exports.keyUp = function(event){
            if(event.key === Qt.Key_Left){
                if(!event.isAutoRepeat){
                    _player.moveDir &= ~(Constants.MOVEDIR_LEFT);
                }
            }

            if(event.key === Qt.Key_Right){
                if(!event.isAutoRepeat){
                    _player.moveDir &= ~(Constants.MOVEDIR_RIGHT);
                }
            }

            if(event.key === Qt.Key_Space){
                if(!event.isAutoRepeat){
                    shoot();
                }
            }
        }

        // Access level: Public
        // Description: Update the game engine one tick. Delta time is calculated internally.
        //  call this method as often as possible to get better animation timing resolutions.
        _exports.update = function () {
            var currentTime = new Date().getTime();
            var dT = (currentTime - _lastUpdateTime);

            // Move player ship.
            if(_player.moveDir === Constants.MOVEDIR_LEFT){
                // Make sure player does not go out of bounds and move the ship to new position.
                _player.setX(Math.max(0, _player.getPosition().x - (Constants.SHIP_SPEED * dT)));
            } else if(_player.moveDir === Constants.MOVEDIR_RIGHT){
                // Make sure player does not go out of bounds and move the ship to new position.
                _player.setX(Math.min(_width-Constants.PLAYERSHIP_WIDTH, _player.getPosition().x + (Constants.SHIP_SPEED * dT)));
            }

            // Update player projectiles, movement and collision checks.
            for(var i=(_playerProjectiles.length-1); i>=0; --i){

                var projectileDeleted = false;
                for(var j=0; j< _enemyShips.length; ++j){
                    if(_enemyShips[j].opacity !== 0){

                        //console.log("testing enemy ship " + j + " against projectile " + i);
                        var box1 = _playerProjectiles[i].physicsBody;
                        var box2 = _enemyShips[j].physicsBody;

                        var collides = box1.testCollision(box2);
                        if(collides){
                            //console.log(" - enemy ship " + j + " collides with projectile " + i);
                            _enemyShips[j].opacity = 0;

                            // update score.
                            _score.setScore(_score.getScore()+10);

                            // destroy qml object.
                            _playerProjectiles[i].destroy();

                            // remove this projectile reference from the collection.
                            _playerProjectiles.splice(i, 1);

                            projectileDeleted = true;
                            break;
                        }
                    }
                }

                // Make sure we dont update a deleted projectile.
                if(projectileDeleted === false){
                    _playerProjectiles[i].y = Math.max(0, _playerProjectiles[i].y - (Constants.PROJECTILE_SPEED * dT));
                }
            }

            // Remove all projectiles that have a y value under 5 (y=0 is top of screen).
            _playerProjectiles = _playerProjectiles.filter( function(value, index, array) {
                if(value.y <= 5){
                    value.destroy();
                }

                return value.y > 5;
            } );

            _lastUpdateTime = new Date().getTime();
        };

        // Access level: Public
        // Description: Clear the game data.
        _exports.clearGameData = function(){
            var i;

            for(i=0; i< _playerProjectiles.length; ++i){
                _playerProjectiles[i].destroy();
            }
            _playerProjectiles = [];

            for(i=0; j< _enemyShips.length; ++i){
                _enemyShips[i].destroy();
            }
            _enemyShips = [];


            for(i=0; j< _enemyProjectiles.length; ++i){
                _enemyProjectiles[i].destroy();
            }
            _enemyProjectiles = [];

            _score.setScore(0);
        }

        // ----------------
        // Private methods
        // ----------------

        // Access level: Private
        // Description: Create a new projectile.
        var shoot = function(){
            var objectName = "playerProjectile";
            var projectileStartX = _player.getPosition().x + (Constants.PLAYERSHIP_WIDTH/2);
            var projectileStartY = _height - (Constants.PLAYERSHIP_HEIGHT+30);
            var completedCallback = function(newObject) {
                if(newObject) {
                    _playerProjectiles.push(newObject);
                } else {
                    console.log("error creating object" + objectName);
                }
            }

            _objectFactory.createObject( objectName,
                         { x: projectileStartX, y: projectileStartY },
                         _root, // object parent
                         completedCallback );
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

            _objectFactory.createObject(shipType, { x: posX, y: posY }, root, completedCallback);
        }

        // Access level: Private
        // Description: Create all enemy ships for a new game.
        var createEnemyShips = function() {
            var i, x, y;
            var columns = 10;

            y = 100;

            // calculate the position to place the first invader.
            x = (_width/2)-((columns*Constants.ENEMYSHIP_WIDTH)/2);

            // 1st row: 11 "squids"
            for(i=0; i<columns; ++i){
                createEnemyShip("enemyShip3", x + (i*Constants.ENEMYSHIP_WIDTH), y);
            }

            y += Constants.ENEMYSHIP_HEIGHT + 10;

            // 2nd row: 11 "bees"
            // 3rd row: 11 "bees"
            for(i=0; i<columns; ++i){
                createEnemyShip("enemyShip1", x + (i*Constants.ENEMYSHIP_WIDTH), y);
            }

            y += Constants.ENEMYSHIP_HEIGHT + 10;

            for(i=0; i<columns; ++i){
                createEnemyShip("enemyShip1", x + (i*Constants.ENEMYSHIP_WIDTH), y);
            }

            y += Constants.ENEMYSHIP_HEIGHT + 10;

            // 4th row: 11 "jellyfish"
            // 5th row: 11 "jellyfish"
            for(i=0; i<columns; ++i){
                createEnemyShip("enemyShip2", x + (i*Constants.ENEMYSHIP_WIDTH), y);
            }

            y += Constants.ENEMYSHIP_HEIGHT + 10;

            for(i=0; i<columns; ++i){
                createEnemyShip("enemyShip2", x + (i*Constants.ENEMYSHIP_WIDTH), y);
            }
        }

        return _exports;
    }(root, width, height));

    return engine;
}
