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

        // 2 dimensional array
        // _enemyShips[constants.INVADER_ROWS][constants.INVADER_COLUMNS]
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
            _player.respawn();
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
            var invaderRow, invaderColumn;
            var currentPlayerProjectile;

            // Move player ship.
            if(_player.moveDir === Constants.MOVEDIR_LEFT){
                // Make sure player does not go out of bounds and move the ship to new position.
                _player.setX(Math.max(0, _player.getPosition().x - (Constants.SHIP_SPEED * dT)));
            } else if(_player.moveDir === Constants.MOVEDIR_RIGHT){
                // Make sure player does not go out of bounds and move the ship to new position.
                _player.setX(Math.min(_width-Constants.PLAYERSHIP_WIDTH, _player.getPosition().x + (Constants.SHIP_SPEED * dT)));
            }

            // Update player projectiles, movement and collision checks.
            for(currentPlayerProjectile=(_playerProjectiles.length-1); currentPlayerProjectile>=0; --currentPlayerProjectile){

                var projectileDeleted = false;

                for(invaderRow=0; invaderRow<_enemyShips.length; ++invaderRow){
                    for(invaderColumn=0; invaderColumn< _enemyShips[invaderRow].length; ++invaderColumn){

                        if(_enemyShips[invaderRow][invaderColumn].opacity !== 0){

                            //console.log("testing enemy ship " + j + " against projectile " + i);
                            var box1 = _playerProjectiles[currentPlayerProjectile].physicsBody;
                            var box2 = _enemyShips[invaderRow][invaderColumn].physicsBody;

                            var collides = box1.testCollision(box2);
                            if(collides){
                                //console.log(" - enemy ship " + j + " collides with projectile " + i);
                                _enemyShips[invaderRow][invaderColumn].opacity = 0;

                                // update score.
                                _score.setScore(_score.getScore()+10);

                                // destroy qml object.
                                _playerProjectiles[currentPlayerProjectile].destroy();

                                // remove this projectile reference from the collection.
                                _playerProjectiles.splice(currentPlayerProjectile, 1);

                                projectileDeleted = true;
                                break;
                            }
                        }
                    }
                }

                // Make sure we dont update a deleted projectile.
                if(projectileDeleted === false){
                    _playerProjectiles[currentPlayerProjectile].y =
                            Math.max(0, _playerProjectiles[currentPlayerProjectile].y - (Constants.PROJECTILE_SPEED * dT));
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
            var i, j;

            for(i=0; i< _playerProjectiles.length; ++i){
                _playerProjectiles[i].destroy();
            }

            _playerProjectiles = [];

            for(i=0; i< _enemyShips.length; ++i){
                for(j=0; j< _enemyShips[i].length; ++j){
                    _enemyShips[i][j].destroy();
                }
            }

            _enemyShips = [];


            for(i=0; i< _enemyProjectiles.length; ++i){
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
        var createEnemyShip = function(shipType, posX, posY, completedCallback) {
            _objectFactory.createObject(shipType, { x: posX, y: posY }, root, completedCallback);
        }

        var foreach = function(array, delegate){
            for(var i=0; i<array.length; ++i){
                delegate(array[i]);
            }
        }

        // Access level: Private
        // Description: Update all invaders.
        var updateInvaders = function(deltaTime) {
//            var timeToMoveIndaders = 0;
//            if(timeToMoveInvaders){
//                moveInvaders();
//            }

//            var bottomInvaders = [];

//            var findBottomInvaders = function(invader){

//            }

//            foreach(invaders, findBottomInvaders);

//            var updateInvaderCombatSystems = function(invader){
//                if(invaderIsAtBottom){
//                    if(invader.timeToShoot()){
//                        invader.shoot();
//                    }
//                }
//            };

//            var checkForInvaderCollisions = function(invader){
//                // check collision vs player.
//                // check collision vs
//            }

//            foreach(invaders, updateInvaderCombatSystems);
//            foreach(invaders, checkForInvaderCollisions);


            // move all invaders as one collection in steps of invader size
            // find the leftmost or rightmost invader(s)
            // do collisionchecks with the bottom invader(s)
            //
            //
            //
            //
            //
        }

        // Access level: Private
        // Description: Create all enemy ships for a new game.
        var createEnemyShips = function() {
            var x, y;
            var row, column;
            var currentRow;
            var callback;

            _enemyShips = [];

            y = 100;

            // calculate the position to place the first invader.
            x = (_width/2)-((Constants.INVADER_COLUMNS*Constants.ENEMYSHIP_WIDTH)/2);

            // the create method is asynchronous so we need to define a completion callback.
            callback = function(newObject) {
                if(newObject) { _enemyShips.push(newObject); currentRow.push(newObject); }
                else { console.log("ERROR: Error creating object " + shipType); }
            }

            for(row=0; row< Constants.INVADER_ROWS; ++row){
                currentRow = [];
                for(column=0; column< Constants.INVADER_COLUMNS; ++column){
                    if(row === 0){ // 1st row: 11 "squids"
                        createEnemyShip("enemyShip3", x + (column*Constants.ENEMYSHIP_WIDTH), y, callback);
                    }
                    else if(row === 1 || row === 2){ // 2nd, 3rd row: 11 "bees"
                        createEnemyShip("enemyShip1", x + (column*Constants.ENEMYSHIP_WIDTH), y, callback);
                    }
                    else if(row === 3 || row === 4){ // 4th, 5th row: 11 "jellyfish"
                        createEnemyShip("enemyShip2", x + (column*Constants.ENEMYSHIP_WIDTH), y, callback);
                    }
                }
                _enemyShips.push(currentRow);
                y += Constants.ENEMYSHIP_HEIGHT + 10;
            }
        }

        return _exports;
    }(root, width, height));

    return engine;
}
