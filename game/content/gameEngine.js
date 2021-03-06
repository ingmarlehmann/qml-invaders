.import "objectFactory.js" as ObjectFactory

.import "player.js" as Player
.import "score.js" as Score
.import "constants.js" as Constants
.import "invaderAI.js" as InvaderAI
.import "physicsEngine.js" as PhysicsEngine
.import "invader.js" as Invader
.import "playerLaserProjectile.js" as PlayerLaserProjectile

function create(width, height){
    var engine = (function (width, height){

        // ----------------
        // Private variables
        // ----------------
        var _lastUpdateTime = new Date().getTime();

        var _playerProjectiles = [];
        var _invaders = [];
        var _physicsDebugBoxes = [];

        var _onNumLivesChangedCb = null;
        var _onScoreChangedCb = null;
        var _onPlayerDiedCb = null;
        var _onAllInvadersDeadCb = null;

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
        function setWidth(width){
            _width = width;
            //console.log("new width: " + _width);
        }

        // Access level: Public
        // Description: Set the content area height for the game engine.
        // Returns: nothing
        function setHeight(height){
            _height = height;
            //console.log("new height: " + _height);
        }

        // Access level: Public
        // Description: Initialize a new game
        // Returns: nothing
        function newGame(){
            _physicsEngine = PhysicsEngine.create();
            _score = Score.create(0);
            _onScoreChangedCb(_score.getScore());

            createPlayer();
            createEnemyShips();
        }

        // Access level: Public
        // Description: Set score changed callback.
        function onScoreChanged(cb){
            _onScoreChangedCb = cb;
        }

        // Access level: Public
        // Description: Set num lives changed callback.
        function onNumLivesChanged(cb){
            _onNumLivesChangedCb = cb;
        }

        // Access level: Public
        // Description: Set played died callback.
        function onPlayerDied(cb){
            _onPlayerDiedCb = cb;
        }

        // Access level: Public
        // Description: set all invaders dead callback.
        function onAllInvadersDead(cb){
            _onAllInvadersDeadCb = cb;
        }

        // Access level: Public
        // Description: Method to inject key _down_ events
        function keyDown(event){
            if(event.key === Qt.Key_Left){
                if(!event.isAutoRepeat){
                    if(_player){
                        _player.moveDir |= Constants.MOVEDIR_LEFT;
                    }
                }
                event.accepted = true;
            }
            if(event.key === Qt.Key_Right){
                if(!event.isAutoRepeat){
                    if(_player){
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
        function keyUp(event){
            if(event.key === Qt.Key_Left){
                if(!event.isAutoRepeat){
                    if(_player){
                        _player.moveDir &= ~(Constants.MOVEDIR_LEFT);
                    }
                }
            }
            else if(event.key === Qt.Key_Right){
                if(!event.isAutoRepeat){
                    if(_player){
                        _player.moveDir &= ~(Constants.MOVEDIR_RIGHT);
                    }
                }
            }
            else if(event.key === Qt.Key_Space){
                if(!event.isAutoRepeat){
                    if(_player){
                        createPlayerProjectile();
                        //PS.PubSub.publish(Constants.TOPIC_PLAYER_FIRED, 0);
                    }
                }
            }
        }

        // Access level: Public
        // Description: Update the game engine one tick. Delta time is calculated internally.
        //  call this method as often as possible to get better animation timing resolutions.
        function update() {
            var currentTime = new Date().getTime();
            var dT = (currentTime - _lastUpdateTime);

            updatePlayer(dT);
            updatePlayerProjectiles(dT);
            updateInvaders(dT);
            updatePhysicsEngine(dT);

            deleteDeadObjects(dT);

            _lastUpdateTime = new Date().getTime();
        };

        // Access level: Public
        // Description: Clear the game data.
        function clearGameData(){
            var i, j;
            if(_player){
                _player.view.destroy();
            }

            for(i=0; i< _playerProjectiles.length; ++i){
                _playerProjectiles[i].view.destroy();
            }

            _playerProjectiles = [];

            for(i=0; i< _invaders.length; ++i){
                for(j=0; j< _invaders[i].length; ++j){
                    if(_invaders[i][j]){
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
        function togglePhysicsDebug(){
            _physicsEngine.togglePhysicsDebug();
        }

        // Access level: Private
        // Description: Animate the player object.
        function updatePlayer(deltaTime){
            if(!_player){
                return;
            }
            // Move player ship.
            if(_player.moveDir === Constants.MOVEDIR_LEFT){
                // Make sure player does not go out of bounds and move the ship to new position.
                _player.setX(Math.max(0, _player.getPosition().getX() - (Constants.SHIP_SPEED * deltaTime)));
            } else if(_player.moveDir === Constants.MOVEDIR_RIGHT){
                // Make sure player does not go out of bounds and move the ship to new position.
                _player.setX(Math.min(_width-Constants.PLAYERSHIP_WIDTH, _player.getPosition().getX() + (Constants.SHIP_SPEED * deltaTime)));
            }
        }

        // Access level: Private
        // Description: Update physics engine.
        function updatePhysicsEngine(deltaTime){
            if(_physicsEngine){
                _physicsEngine.update();
            }
        }

        // Access level: Private
        // Description: Animate player projectiles.
        function updatePlayerProjectiles(deltaTime){
            var currentPlayerProjectile;

            // Update player projectiles movement.
            for(currentPlayerProjectile = (_playerProjectiles.length-1);
                currentPlayerProjectile >= 0;
                --currentPlayerProjectile)
            {
                _playerProjectiles[currentPlayerProjectile].setY(
                        Math.max(0, _playerProjectiles[currentPlayerProjectile].getPosition().getY()
                                 - (Constants.PLAYER_PROJECTILE_SPEED * deltaTime)));
            }

            // Remove all projectiles that have a y value under 5 (y=0 is top of screen).
            var i;
            for(i=0; i< _playerProjectiles.length; ++i){
                if(_playerProjectiles[i].getPosition().getY() <=5){
                    _playerProjectiles[i].deleteLater();
                }
            }
        }

        // Access level: Private
        // Description: Update all invaders.
        function updateInvaders(deltaTime) {
            if(_invaderAI){
                _invaderAI.update(deltaTime);
            }
        }

        // Access level: Private
        // Description: delete all invaders that have been marked for deletion.
        function deleteDeadInvaders(){
            var row, column;
            for(row=0; row < _invaders.length; ++row){
                for(column=0; column < _invaders[row].length; ++column){;
                    if(_invaders[row][column]){
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
        function deleteDeadPlayerProjectiles(){
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
        function deleteDeadPlayers(){
            if(_player){
                if(_player.isToBeDeleted()){
                    _player.view.destroy();
                    _player = null;
                }
            }
        }

        // Access level: Private
        // Description: Delete all objects marked for deletion.
        function deleteDeadObjects(deltaTime){
            deleteDeadInvaders();
            deleteDeadPlayerProjectiles();
            deleteDeadPlayers();
        }

        // Access level: Private
        // Description: Create a new projectile.
        function createPlayerProjectile(){
            var objectName = "playerProjectile";

            var projectileStartX = _player.getPosition().getX() + (Constants.PLAYERSHIP_WIDTH/2);
            var projectileStartY = _player.getPosition().getY() - (Constants.PLAYERSHIP_HEIGHT/2);

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
        function createPlayer(){
            var onPlayerCreated = function(player){
                _player = player;
                _player.setPosition(
                            (_width/2)-(Constants.PLAYERSHIP_WIDTH/2),
                            _height-(Constants.PLAYERSHIP_HEIGHT/2)-60);

                _player.respawn();
                _physicsEngine.registerPhysicsObject(_player.physicsObject);
                _player.view.died.connect(_onPlayerDiedCb);
                _player.view.numLivesChanged.connect(_onNumLivesChangedCb);
                _player.view.numLivesChanged(3);
            }
            Player.create({ x: 0, y: 0, lives: 3 }, onPlayerCreated);
        }

        // Access level: Private
        // Description: Create all enemy ships for a new game.
        function createEnemyShips() {
            var x, y;
            var row, column, currentRow;
            var onInvaderCreated;
            var createOptions;

            _invaders = [];

            // Create invader game objects.
            y = 100;

            // Calculate the position to place the first invader.
            x = (_width/2)-((Constants.INVADER_COLUMNS*Constants.ENEMYSHIP_WIDTH)/2);

            // The create method is asynchronous so we need to define a completion callback.
            onInvaderCreated = function(invader) {
                if(invader){
                    currentRow.push(invader);
                    _physicsEngine.registerPhysicsObject(invader.physicsObject);
                    invader.view.died.connect(onInvaderDeath);
                }
                else{
                    console.log("ERROR: Error creating invader.");
                }
            }

            for(row=0; row< Constants.INVADER_ROWS; ++row){
                currentRow = [];
                for(column=0; column< Constants.INVADER_COLUMNS; ++column){

                    createOptions = {
                        x: x + (column*Constants.ENEMYSHIP_WIDTH),
                        y: y,
                        invadertype: getInvaderType(row)};

                    Invader.create(createOptions, onInvaderCreated);
                }
                _invaders.push(currentRow);
                if(_invaders.length == Constants.INVADER_ROWS){
                    _invaderAI = InvaderAI.create(_physicsEngine, _invaders);
                    if(!_onAllInvadersDeadCb)
                        throw "_onAllInvadersDeadCb has not been set."
                    _invaderAI.onAllInvadersDead(_onAllInvadersDeadCb);
                }
                y += Constants.ENEMYSHIP_HEIGHT + 10;
            }
        }

        // Access level: Private
        // Description: Callback for when an invader dies.
        function onInvaderDeath(){
            _score.setScore(_score.getScore()+10);
            if(_onScoreChangedCb){
                _onScoreChangedCb(_score.getScore());
            }
            _invaderAI.onInvaderDeath();
        }

        // Access level: Private
        // Description: get what type of invader shall
        // be created for a given row number.
        function getInvaderType(row){
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

        return {
            newGame: newGame,
            update: update,
            clearGameData: clearGameData,

            keyUp: keyUp,
            keyDown: keyDown,

            setWidth: setWidth,
            setHeight: setHeight,

            onNumLivesChanged: onNumLivesChanged,
            onScoreChanged: onScoreChanged,
            onPlayerDied: onPlayerDied,
            onAllInvadersDead: onAllInvadersDead,
        };
    }(width, height));

    return engine;
}
