.import "objectFactory.js" as ObjectFactory

.import "player.js" as Player
.import "score.js" as Score
.import "constants.js" as Constants
.import "pubsub.js" as PS
.import "invaderAI.js" as InvaderAI
.import "physicsEngine.js" as PhysicsEngine
.import "invader.js" as Invader
.import "playerLaserProjectile.js" as PlayerLaserProjectile

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
        var _invaders = [];
        var _physicsDebugBoxes = [];

        var _width = width;
        var _height = height;
        var _root = root;

        var _score = null;
        var _player = null;
        var _physicsEngine = null;

        var _invaderAI = null;

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
            _physicsEngine = PhysicsEngine.create();
            _score = Score.create(0);

            createPlayer();
            createEnemyShips();

            _setupEventListeners();
        }

        // Access level: Public
        // Description: Method to inject key _down_ events
        _exports.keyDown = function(event){
            if(event.key === Qt.Key_Left){
                if(!event.isAutoRepeat){
                    if(_player !== null && _player !== undefined){
                        _player.moveDir |= Constants.MOVEDIR_LEFT;
                    }
                }

                event.accepted = true;
            }
            if(event.key === Qt.Key_Right){
                if(!event.isAutoRepeat){
                    if(_player !== null && _player !== undefined){
                        _player.moveDir |= Constants.MOVEDIR_RIGHT;
                    }
                }

                event.accepted = true;
            }
            if(event.key === Qt.Key_P){
                if(!event.isAutoRepeat){
                    togglePhysicsDebug();
                }
            }
        }

        // Access level: Public
        // Description: Method to inject key _up_ events
        _exports.keyUp = function(event){
            if(event.key === Qt.Key_Left){
                if(!event.isAutoRepeat){
                    if(_player !== null && _player !== undefined){
                        _player.moveDir &= ~(Constants.MOVEDIR_LEFT);
                    }
                }
            }

            if(event.key === Qt.Key_Right){
                if(!event.isAutoRepeat){
                    if(_player !== null && _player !== undefined){
                        _player.moveDir &= ~(Constants.MOVEDIR_RIGHT);
                    }
                }
            }

            if(event.key === Qt.Key_Space){
                if(!event.isAutoRepeat){
                    if(_player !== null && _player !== undefined){
                        createPlayerProjectile();
                        PS.PubSub.publish(Constants.TOPIC_PLAYER_FIRED, 0);
                    }
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

            updatePlayer(dT);
            updateInvaders(dT);
            updatePhysicsEngine(dT);

            // Update player projectiles collision checks.
            for(currentPlayerProjectile = (_playerProjectiles.length-1);
                currentPlayerProjectile >= 0;
                --currentPlayerProjectile)
            {
//                for(invaderRow=0; invaderRow<_invaders.length; ++invaderRow){
//                    for(invaderColumn=0; invaderColumn< _invaders[invaderRow].length; ++invaderColumn){

//                        if(_invaders[invaderRow][invaderColumn].visible !== false){

//                            //console.log("testing enemy ship " + j + " against projectile " + i);
//                            var box1 = _playerProjectiles[currentPlayerProjectile].physicsBody;
//                            var box2 = _invaders[invaderRow][invaderColumn].physicsBody;

//                            var collides = box1.testCollision(box2);
//                            if(collides){
//                                //console.log(" - enemy ship " + j + " collides with projectile " + i);
//                                _invaders[invaderRow][invaderColumn].visible = false;

//                                // update score.
//                                _score.setScore(_score.getScore()+10);

//                                // destroy qml object.
//                                _playerProjectiles[currentPlayerProjectile].destroy();

//                                // remove this projectile reference from the collection.
//                                _playerProjectiles.splice(currentPlayerProjectile, 1);

//                                projectileDeleted = true;

//                                PS.PubSub.publish(Constants.TOPIC_ENEMY_DIED, 0);

//                                break;
//                            }
//                        }
//                    }
//                }

                // Update player projectiles movement.
                _playerProjectiles[currentPlayerProjectile].setY(
                        Math.max(0, _playerProjectiles[currentPlayerProjectile].getPosition().y - (Constants.PLAYER_PROJECTILE_SPEED * dT)));
            }

            // Remove all projectiles that have a y value under 5 (y=0 is top of screen).
            var i;
            for(i=0; i< _playerProjectiles.length; ++i){
                if(_playerProjectiles[i].getPosition().y <=5){
                    _playerProjectiles[i].deleteLater();
                }
            }

            deleteDeadObjects(dT);

            _lastUpdateTime = new Date().getTime();
        };

        // Access level: Public
        // Description: Clear the game data.
        _exports.clearGameData = function(){
            var i, j;

            if(_player !== null && _player !== undefined){
                _player.view.destroy();
            }

            for(i=0; i< _playerProjectiles.length; ++i){
                _playerProjectiles[i].view.destroy();
            }

            _playerProjectiles = [];

            for(i=0; i< _invaders.length; ++i){
                for(j=0; j< _invaders[i].length; ++j){
                    _invaders[i][j].view.destroy();
                }
            }

            _invaders = [];

            _score.setScore(0);

            _invaderAI.destroy();
        }

        // ----------------
        // Private methods
        // ----------------

        var togglePhysicsDebug = function(){
            _physicsEngine.togglePhysicsDebug();
        }

        var updatePlayer = function(deltaTime){
            if(_player == null || _player == undefined){
                return;
            }

            // Move player ship.
            if(_player.moveDir === Constants.MOVEDIR_LEFT){
                // Make sure player does not go out of bounds and move the ship to new position.
                _player.setX(Math.max(0, _player.getPosition().x - (Constants.SHIP_SPEED * deltaTime)));
            } else if(_player.moveDir === Constants.MOVEDIR_RIGHT){
                // Make sure player does not go out of bounds and move the ship to new position.
                _player.setX(Math.min(_width-Constants.PLAYERSHIP_WIDTH, _player.getPosition().x + (Constants.SHIP_SPEED * deltaTime)));
            }
        }

        var updatePhysicsEngine = function(deltaTime){
            if(_physicsEngine !== null && _physicsEngine !== undefined){
                _physicsEngine.update();
            }
        }

        // Access level: Private
        // Description: Update all invaders.
        var updateInvaders = function(deltaTime) {
            var i;

            if(_invaderAI !== null){
                _invaderAI.update(deltaTime);
            }
        }

        var deleteDeadObjects = function(deltaTime){
            var i, row, column;

            for(row=(_invaders.length-1); row >= 0; --row){
                for(column=(_invaders[row].length-1); column >= 0; --column){
                    if(_invaders[row][column].isToBeDeleted()){
                        _invaders[row][column].view.destroy();
                        _invaders[row].splice(column, 1); // WTF?? I can't splice in a 2 dimensional array!!
                    }
                }
            }

            for(i=(_playerProjectiles.length-1); i >= 0; --i){
                if(_playerProjectiles[i].isToBeDeleted()){
                    _playerProjectiles[i].view.destroy();
                    _playerProjectiles.splice(i, 1);
                }
            }

            if(_player !== undefined && _player !== null){
                if(_player.isToBeDeleted()){
                    _player.view.destroy();
                    _player = null;
                }
            }
        }

        // Access level: Private
        // Description: Create a new projectile.
        var createPlayerProjectile = function(){
            var objectName = "playerProjectile";

            var projectileStartX = _player.getPosition().x + (Constants.PLAYERSHIP_WIDTH/2);
            var projectileStartY = _height - (Constants.PLAYERSHIP_HEIGHT+30);

            var completedCallback = function(newObject) {
                if(newObject) {
                    _playerProjectiles.push(newObject);
                    _physicsEngine.registerPhysicsObject(newObject.physicsObject);
                } else {
                    console.log("error creating object" + objectName);
                }
            }

            PlayerLaserProjectile.create(
                        { x: projectileStartX, y: projectileStartY },
                        completedCallback);

        }

        // Access level: Private
        // Description: Set up the player object
        // Returns: nothing
        var createPlayer = function(){
            var onPlayerCreated = function(player){
                _player = player;
                _player.setPosition((_width/2)-(Constants.PLAYERSHIP_WIDTH/2), _height-(Constants.PLAYERSHIP_HEIGHT/2));
                _player.respawn();

                _physicsEngine.registerPhysicsObject(_player.physicsObject);
            }

            Player.create({ x: 0, y: 0, lives: 3 }, onPlayerCreated);
        }

        // Access level: Private
        // Description: Create all enemy ships for a new game.
        var createEnemyShips = function() {
            var x, y;
            var row, column, currentRow;
            var onInvaderCreated;
            var createOptions;
            var numInvadersCreated = 0;

            _invaders = [];

            // Create invader game objects.
            y = 100;

            // calculate the position to place the first invader.
            x = (_width/2)-((Constants.INVADER_COLUMNS*Constants.ENEMYSHIP_WIDTH)/2);

            // the create method is asynchronous so we need to define a completion callback.
            onInvaderCreated = function(invader) {
                if(invader !== null && invader !== undefined) {
                    currentRow.push(invader);
                    _physicsEngine.registerPhysicsObject(invader.physicsObject);
                }
                else {
                    console.log("ERROR: Error creating invader.");
                }

                ++numInvadersCreated;
                if(numInvadersCreated === (Constants.INVADER_ROWS*Constants.INVADER_COLUMNS)){
                    _invaderAI = InvaderAI.create(_physicsEngine, _invaders);
                }
            }

            for(row=0; row< Constants.INVADER_ROWS; ++row){
                currentRow = [];
                for(column=0; column< Constants.INVADER_COLUMNS; ++column){

                    createOptions = {
                        x: x + (column*Constants.ENEMYSHIP_WIDTH),
                        y: y,
                        invadertype: _getInvaderType(row)};

                    Invader.create(createOptions, onInvaderCreated);
                }
                _invaders.push(currentRow);
                y += Constants.ENEMYSHIP_HEIGHT + 10;
            }
        }

        var _setupEventListeners = function(){
            var row, column;
            for(row=0; row< _invaders.length; ++row){
                for(column=0; column< _invaders[row].length; ++column){
                    //_invaders[row][column].on("death", function(data){ console.log("invader died"); });
                    _invaders[row][column].on("death", function(data){
                        _score.setScore(_score.getScore()+10);
                    });
                }
            }
        }

        // Access level: Private
        // Description: get what type of invader shall
        // be created for a given row number.
        var _getInvaderType = function(row){
            if(row === 0){ // 1st row: 11 "squids"
                return 'invader3';
            }
            else if(row === 1 || row === 2){ // 2nd, 3rd row: 11 "bees"
                return 'invader2';
            }
            else if(row === 3 || row === 4){ // 4th, 5th row: 11 "jellyfish"
                return 'invader1';
            }

            return 'undefined';
        }

        return _exports;
    }(root, width, height));

    return engine;
}
