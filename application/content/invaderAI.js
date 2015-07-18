.import "constants.js" as Constants
.import "pubsub.js" as PS
.import "objectFactory.js" as ObjectFactory
.import "invaderLaserProjectile.js" as InvaderLaserProjectile
.import "aabb.js" as AABB
.import "vector2d.js" as Vector2d

// Create an invader AI engine.
// The AI engine needs to be updated each frame with delta time.
//
// create:
//   .import "invaderAI.js" as InvaderAI
//   var _rowOfInvaders = [];
//   var _matrixOfInvaders = [];
//
//   _matrixOfInvaders.push(_rowOfInvaders);
//   _matrixOfInvaders.push(_rowOfInvaders);
//   _matrixOfInvaders.push(_rowOfInvaders);
//
//   var invaderAI = InvaderAI.createInvaderAI(_matrixOfInvaders);
//
// update:
//   invaderAI.update(deltaTime);
//

function create(physicsEngine, invadersToControl){
    var invaderAI = (function(physicsEngine, invadersToControl){

        var _exports = {};

        // ----------------
        // Private variables
        // ----------------
        var _moveDir = Constants.MOVEDIR_RIGHT;
        var _prevMoveDir = Constants.MOVEDIR_LEFT;

        var _moveTimer = 0;
        var _moveInterval = 2000;

        var _shootTimer = 0;
        var _shootInterval = 1000;

        var _timeElapsed = 0;

        var _invaders = invadersToControl;

        var _enemyProjectiles = [];
        var _physicsEngine = physicsEngine;

        // ----------------
        // Public methods
        // ----------------

        // Clean up all data created by InvaderAI.
        // Always call this method before releasing the InvaderAI object.
        _exports.destroy = function(){
            var i;

            for(i=0; i< _enemyProjectiles.length; ++i){
                _enemyProjectiles[i].view.destroy();
            }
        }

        // Update the InvaderAI one step.
        _exports.update = function(deltaTime){

            _timeElapsed += deltaTime;

            _updateInvaderMovement(deltaTime);
            _updateInvaderWeaponSystems(deltaTime);
            _animateInvaderProjectiles(deltaTime);

            _deleteDeadObjects(deltaTime);
        }

        // ----------------
        // Private methods
        // ----------------
        var _updateInvaderWeaponSystems = function(deltaTime){
            if((_shootTimer + _shootInterval) <= _timeElapsed){
                _shootTimer = _timeElapsed;

                _fireInvaderWeaponSystems();
            }
        }

        var _updateInvaderMovement = function(deltaTime){
            // Time to move pack?
            if((_moveTimer + _moveInterval) <= _timeElapsed){
                _moveTimer = _timeElapsed;

                _moveInvaderPack();
            }
        }

        var _animateInvaderProjectiles = function(deltaTime){
            var i, oldYPosition, newYPosition;

            // update enemy projectile movements.
            for(i=0; i< _enemyProjectiles.length; ++i){
                oldYPosition =
                        _enemyProjectiles[i].getPosition().y;

                newYPosition =
                        Math.min(Constants.GAME_HEIGHT-60, oldYPosition + (Constants.ENEMY_PROJECTILE_SPEED * deltaTime));

                _enemyProjectiles[i].setY(newYPosition);

                if(newYPosition >= Constants.GAME_HEIGHT-60){
                    _enemyProjectiles[i].deleteLater();
                }
            }
        }

        var _deleteDeadObjects = function(deltaTime){
            var i;

            for(i=(_enemyProjectiles.length-1); i >= 0; --i){
                if(_enemyProjectiles[i].isToBeDeleted() === true){
                    _enemyProjectiles[i].view.destroy();
                    _enemyProjectiles.splice(i, 1);
                }
            }
        }

        var _moveInvaderPack = function(){
            // Is pack moving left or right?
            if(_moveDir === Constants.MOVEDIR_RIGHT || _moveDir === Constants.MOVEDIR_LEFT){
                // Try moving in the set move direction.
                if(!_move(_moveDir)){
                    // The move failed, we hit a wall, change move direction.
                    if(_moveDir === Constants.MOVEDIR_RIGHT){
                        _prevMoveDir = _moveDir;
                        _moveDir = Constants.MOVEDIR_DOWN;
                    }
                    else if(_moveDir === Constants.MOVEDIR_LEFT){
                        _prevMoveDir = _moveDir;
                        _moveDir = Constants.MOVEDIR_DOWN;
                    }
                }
            }
            // Is pack moving down?
            if(_moveDir === Constants.MOVEDIR_DOWN){
                // move one step down
                if(!_move(_moveDir)){
                    console.log("ERROR; Can't move invader pack");
                }

                if(_prevMoveDir === Constants.MOVEDIR_LEFT){
                    _moveDir = Constants.MOVEDIR_RIGHT;
                }
                else if(_prevMoveDir === Constants.MOVEDIR_RIGHT){
                    _moveDir = Constants.MOVEDIR_LEFT;
                }
            }
        }

        var _fireInvaderWeaponSystems = function(){
            // find all the bottom invaders.
            var row, column;
            var bottomInvaders = [];
            var randomInvader;

            for(column=0; column< Constants.INVADER_COLUMNS; ++column){
                for(row=(Constants.INVADER_ROWS-1); row>= 0; --row){
                   if(_invaders[row][column] !== undefined && _invaders[row][column] !== null){
                       bottomInvaders.push(_invaders[row][column]);
                       break;
                   }
                }
            }

            // All invaders are dead. This event needs to be documented better.
            if(bottomInvaders.length === 0){
                PS.PubSub.publish(Constants.TOPIC_ALL_INVADERS_DEAD, true);
                return;
            }

            // Choose one invader at random out of the bottom invaders
            // that will fire a missile towards the player.
            randomInvader = bottomInvaders[Math.floor(Math.random() * bottomInvaders.length)];

            PS.PubSub.publish(Constants.TOPIC_ENEMY_FIRED, 0);            

            _createEnemyProjectile(randomInvader.view.x + (Constants.ENEMYSHIP_WIDTH/2),
                                  randomInvader.view.y + (Constants.ENEMYSHIP_HEIGHT));
        }

        // Access level: Private
        // Description: Create a new enemy projectile.
        var _createEnemyProjectile = function(positionX,
                                             positionY){

            var objectName = "enemyProjectile";
            var onProjectileCreated = function(newObject) {
                if(newObject) {
                    _enemyProjectiles.push(newObject);
                    _physicsEngine.registerPhysicsObject(newObject.physicsObject);
                } else {
                    console.log("error creating object" + objectName);
                }
            }

            InvaderLaserProjectile.create(
                        { x: positionX, y: positionY },
                        onProjectileCreated);
        }

        var _move = function(moveDir){
            if(moveDir === Constants.MOVEDIR_LEFT){
                return _moveLeft();
            }
            else if(moveDir === Constants.MOVEDIR_RIGHT){
                return _moveRight();
            }
            else if(moveDir === Constants.MOVEDIR_DOWN){
                return _moveDown();
            }
        }

        var _moveRight = function(){
            var column = 0, row = 0;

            var aabb = _getInvaderPackBoundingBox();
            if(aabb === undefined){
                return; // all invaders are dead.
            }

            //console.log("moving right. invader aabb: min.x: " + aabb.min.x + " max.x: " + aabb.max.x + " min.y: " + aabb.min.y + " max.y: " + aabb.max.y);

            if((aabb.getMax().x + 5) >= 690){
                return false;
            }

            for(row=0; row< _invaders.length; ++row){
                for(column=0; column< _invaders[row].length; ++column){
                    if(_invaders[row][column] !== null && _invaders[row][column] !== undefined){
                        _invaders[row][column].appendX(Constants.ENEMYSHIP_WIDTH);
                    }
                }
            }

            return true;
        }

        var _moveLeft = function(){
            var column = 0, row = 0;

            var aabb = _getInvaderPackBoundingBox();
            if(aabb === undefined){
                return; // all invaders are dead.
            }
            //console.log("moving left. invader aabb: min.x: " + aabb.min.x + " max.x: " + aabb.max.x + " min.y: " + aabb.min.y + " max.y: " + aabb.max.y);

            if(Math.max(0, aabb.getMin().x - 5) === 0){
                return false;
            }

            for(row=0; row< _invaders.length; ++row){
                for(column=0; column< _invaders[row].length; ++column){
                    if(_invaders[row][column] !== null && _invaders[row][column] !== undefined){
                        _invaders[row][column].appendX(-Constants.ENEMYSHIP_WIDTH);
                    }
                }
            }

            return true;
        }

        var _moveDown = function(){
            var column = 0, row = 0;

            //var aabb = _getInvaderPackBoundingBox();
            //console.log("moving down. invader aabb: min.x: " + aabb.min.x + " max.x: " + aabb.max.x + " min.y: " + aabb.min.y + " max.y: " + aabb.max.y);

            for(row=0; row< _invaders.length; ++row){
                for(column=0; column< _invaders[row].length; ++column){
                    if(_invaders[row][column] !== null && _invaders[row][column] !== undefined){
                        _invaders[row][column].appendY(Constants.ENEMYSHIP_HEIGHT);
                    }
                }
            }

            return true;
        }

        var _getInvaderPackBoundingBox = function(){

            var row, column;
            var atLeastOneInvaderAlive = false;

            var aabb = AABB.create(0,
                                   0,
                                   Vector2d.create(
                                       Constants.GAME_WIDTH/2,
                                       Constants.GAME_HEIGHT/2));

            for(row=0; row< _invaders.length; ++row){
                for(column=0; column< _invaders[row].length; ++column){
                    if(_invaders[row][column] !== null && _invaders[row][column] !== undefined){
                        atLeastOneInvaderAlive = true;
                        aabb.merge(_invaders[row][column].physicsObject.physicsBody);
                    }
                }
            }

            if(!atLeastOneInvaderAlive){
                return undefined;
            }

            return aabb;
        }

        return _exports;

    }(physicsEngine, invadersToControl));

    return invaderAI;
};
