.import "objectFactory.js" as ObjectFactory

.import "player.js" as Player
.import "score.js" as Score
.import "constants.js" as Constants
.import "pubsub.js" as PS
.import "invaderAI.js" as InvaderAI
.import "physicsEngine.js" as PhysicsEngine
.import "invader.js" as Invader
.import "playerLaserProjectile.js" as PlayerLaserProjectile

function create(width, height){
    var engine = (function (width, height) {

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

        var _score = null;
        var _player = null;
        var _physicsEngine = null;

        var _invaderAI = null;

        // ----------------
        // Public variables
        // ----------------


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

            _createPlayer();
            _createEnemyShips();

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
                    _togglePhysicsDebug();
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
                        _createPlayerProjectile();
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

            _updatePlayer(dT);
            _updatePlayerProjectiles(dT);
            _updateInvaders(dT);
            _updatePhysicsEngine(dT);

            _deleteDeadObjects(dT);

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
                    if(_invaders[i][j] !== null && _invaders[i][j] !== undefined){
                        _invaders[i][j].view.destroy();
                    }
                }
            }

            _invaders = [];

            _score.setScore(0);

            _invaderAI.destroy();

            _physicsEngine.destroy();
        }

        // ----------------
        // Private methods
        // ----------------

        // Access level: Private
        // Description: Enable or disable visual physics debugging.
        var _togglePhysicsDebug = function(){
            _physicsEngine.togglePhysicsDebug();
        }

        // Access level: Private
        // Description: Animate the player object.
        var _updatePlayer = function(deltaTime){
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

        // Access level: Private
        // Description: Update physics engine.
        var _updatePhysicsEngine = function(deltaTime){
            if(_physicsEngine !== null && _physicsEngine !== undefined){
                _physicsEngine.update();
            }
        }

        // Access level: Private
        // Description: Animate player projectiles.
        var _updatePlayerProjectiles = function(deltaTime){
            var currentPlayerProjectile;

            // Update player projectiles movement.
            for(currentPlayerProjectile = (_playerProjectiles.length-1);
                currentPlayerProjectile >= 0;
                --currentPlayerProjectile)
            {
                _playerProjectiles[currentPlayerProjectile].setY(
                        Math.max(0, _playerProjectiles[currentPlayerProjectile].getPosition().y
                                 - (Constants.PLAYER_PROJECTILE_SPEED * deltaTime)));
            }

            // Remove all projectiles that have a y value under 5 (y=0 is top of screen).
            var i;
            for(i=0; i< _playerProjectiles.length; ++i){
                if(_playerProjectiles[i].getPosition().y <=5){
                    _playerProjectiles[i].deleteLater();
                }
            }
        }

        // Access level: Private
        // Description: Update all invaders.
        var _updateInvaders = function(deltaTime) {
            if(_invaderAI !== null){
                _invaderAI.update(deltaTime);
            }
        }

        // Access level: Private
        // Description: delete all invaders that have been marked for deletion.
        var _deleteDeadInvaders = function(){
            var row, column;

            for(row=0; row < _invaders.length; ++row){
                for(column=0; column < _invaders[row].length; ++column){;
                    if(_invaders[row][column] !== null && _invaders[row][column] !== undefined){
                        if(_invaders[row][column].isToBeDeleted()){
                            _invaders[row][column].view.destroy();
                            _invaders[row][column] = null;
                        }
                    }
                }
            }
        }

        // Access level: Private
        // Description: delete all player projectiles that have been marked for deletion.
        var _deleteDeadPlayerProjectiles = function(){
            var i;

            for(i=(_playerProjectiles.length-1); i >= 0; --i){
                if(_playerProjectiles[i].isToBeDeleted()){
                    _playerProjectiles[i].view.destroy();
                    _playerProjectiles.splice(i, 1);
                }
            }
        }

        // Access level: Private
        // Description: delete all player projectiles that have been marked for deletion.
        var _deleteDeadPlayers = function(){
            if(_player !== undefined && _player !== null){
                if(_player.isToBeDeleted()){
                    _player.view.destroy();
                    _player = null;
                }
            }
        }

        // Access level: Private
        // Description: Delete all objects marked for deletion.
        var _deleteDeadObjects = function(deltaTime){

            _deleteDeadInvaders();
            _deleteDeadPlayerProjectiles();
            _deleteDeadPlayers();
        }

        // Access level: Private
        // Description: Create a new projectile.
        var _createPlayerProjectile = function(){
            var objectName = "playerProjectile";

            var projectileStartX = _player.getPosition().x + (Constants.PLAYERSHIP_WIDTH/2);
            var projectileStartY = _player.getPosition().y - (Constants.PLAYERSHIP_HEIGHT/2);

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
        var _createPlayer = function(){
            var onPlayerCreated = function(player){
                _player = player;

                _player.setPosition(
                            (_width/2)-(Constants.PLAYERSHIP_WIDTH/2),
                            _height-(Constants.PLAYERSHIP_HEIGHT/2)-60);

                _player.respawn();

                _physicsEngine.registerPhysicsObject(_player.physicsObject);
            }

            Player.create({ x: 0, y: 0, lives: 3 }, onPlayerCreated);
        }

        // Access level: Private
        // Description: Create all enemy ships for a new game.
        var _createEnemyShips = function() {
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

        // Access level: Private
        // Description: Create all enemy ships for a new game.
        var _setupEventListeners = function(){
            var row, column;

            for(row=0; row < _invaders.length; ++row){
                for(column=0; column < _invaders[row].length; ++column){
                    if(_invaders[row][column] !== null && _invaders[row][column] !== undefined){
                        _invaders[row][column].on("death", function(data){
                            _score.setScore(_score.getScore()+10);
                        });
                    }
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
    }(width, height));

    return engine;
}
