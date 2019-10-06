.import "constants.js" as Constants
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

        // ----------------
        // Private variables
        // ----------------
        var _moveDir = Constants.MOVEDIR_RIGHT;
        var _prevMoveDir = Constants.MOVEDIR_LEFT;
        var _onAllInvadersDeadCb = null;

        var _moveTimer = 0;
        var _moveInterval = 2000;

        var _shootTimer = 0;
        var _shootInterval = 1000;

        var _timeElapsed = 0;

        var _invaders = invadersToControl;

        var _enemyProjectiles = [];
        var _physicsEngine = physicsEngine;

        var _numInvadersAlive;

        // ----------------
        // Public methods
        // ----------------

        // Clean up all data created by InvaderAI.
        // Always call this method before releasing the InvaderAI object.
        function destroy(){
            var i;

            for(i=0; i< _enemyProjectiles.length; ++i){
                _enemyProjectiles[i].view.destroy();
            }

            _numInvadersAlive = 0;
        }

        // Update the InvaderAI one step.
        function update(deltaTime){
            _timeElapsed += deltaTime;

            updateInvaderMovement(deltaTime);
            updateInvaderWeaponSystems(deltaTime);
            animateInvaderProjectiles(deltaTime);

            deleteDeadObjects(deltaTime);
        }

        // ----------------
        // Private methods
        // ----------------
        function countInvaders(invaders){
            var row, column;
            var numInvaders = 0;
            for(row=0; row< invaders.length; ++row){
                for(column=0; column< invaders[row].length; ++column){
                    if(invaders[row][column] !== null && invaders[row][column] !== undefined){
                        ++numInvaders;
                    }
                }
            }
            return numInvaders;
        }

        function updateInvaderWeaponSystems(deltaTime){
            if((_shootTimer + _shootInterval) <= _timeElapsed){
                _shootTimer = _timeElapsed;

                fireInvaderWeaponSystems();
            }
        }

        function updateInvaderMovement(deltaTime){
            // Time to move pack?
            if((_moveTimer + _moveInterval) <= _timeElapsed){
                _moveTimer = _timeElapsed;

                moveInvaderPack();
            }
        }

        function animateInvaderProjectiles(deltaTime){
            var i, oldYPosition, newYPosition;
            var ymax;
            var ynext;

            // update enemy projectile movements.
            for(i=0; i< _enemyProjectiles.length; ++i){
                oldYPosition =
                        _enemyProjectiles[i].getPosition().getY();

                ymax = Constants.GAME_HEIGHT-40;
                ynext = oldYPosition + (Constants.ENEMY_PROJECTILE_SPEED * deltaTime);
                newYPosition = Math.min(ymax,ynext);

                _enemyProjectiles[i].setY(newYPosition);
                if(newYPosition >= ymax){
                    _enemyProjectiles[i].deleteLater();
                }
            }
        }

        function deleteDeadObjects(deltaTime){
            var i;

            for(i=(_enemyProjectiles.length-1); i >= 0; --i){
                if(_enemyProjectiles[i].isToBeDeleted() === true){
                    _enemyProjectiles[i].view.destroy();
                    _enemyProjectiles.splice(i, 1);
                }
            }
        }

        function moveInvaderPack(){
            // Is pack moving left or right?
            if(_moveDir === Constants.MOVEDIR_RIGHT || _moveDir === Constants.MOVEDIR_LEFT){
                // Try moving in the set move direction.
                if(!move(_moveDir)){
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
                if(!move(_moveDir)){
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

        function fireInvaderWeaponSystems(){
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

            // All invaders are dead.
            if(bottomInvaders.length === 0){
                return;
            }

            // Choose one invader at random out of the bottom invaders
            // that will fire a missile towards the player.
            randomInvader = bottomInvaders[Math.floor(Math.random() * bottomInvaders.length)];

            //PS.PubSub.publish(Constants.TOPIC_ENEMY_FIRED, 0);

            createEnemyProjectile(randomInvader.view.x + (Constants.ENEMYSHIP_WIDTH/2),
                                  randomInvader.view.y + (Constants.ENEMYSHIP_HEIGHT));
        }

        // Access level: Private
        // Description: Create a new enemy projectile.
        function createEnemyProjectile(positionX, positionY){
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

        function move(moveDir){
            if(moveDir === Constants.MOVEDIR_LEFT){
                return moveLeft();
            }
            else if(moveDir === Constants.MOVEDIR_RIGHT){
                return moveRight();
            }
            else if(moveDir === Constants.MOVEDIR_DOWN){
                return moveDown();
            }
        }

        function moveRight(){
            var column = 0, row = 0;

            var aabb = getInvaderPackBoundingBox();
            if(!aabb){
                return; // all invaders are dead.
            }

            if((aabb.getMax().getX() + 5) >= 690){
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

        function moveLeft(){
            var column = 0, row = 0;

            var aabb = getInvaderPackBoundingBox();
            if(aabb === undefined){
                return; // all invaders are dead.
            }

            if(Math.max(0, aabb.getMin().getX() - 5) === 0){
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

        function moveDown(){
            var column = 0, row = 0;
            for(row=0; row< _invaders.length; ++row){
                for(column=0; column< _invaders[row].length; ++column){
                    if(_invaders[row][column]){
                        _invaders[row][column].appendY(Constants.ENEMYSHIP_HEIGHT);
                    }
                }
            }

            return true;
        }

        function getInvaderPackBoundingBox(){
            var row, column;
            var atLeastOneInvaderAlive = false;

            var aabb = AABB.create(0,
                                   0,
                                   Vector2d.create(
                                       Constants.GAME_WIDTH/2,
                                       Constants.GAME_HEIGHT/2));

            for(row=0; row< _invaders.length; ++row){
                for(column=0; column< _invaders[row].length; ++column){
                    if(_invaders[row][column]){
                        atLeastOneInvaderAlive = true;
                        aabb = aabb.merge(_invaders[row][column].physicsObject.physicsBody);
                    }
                }
            }

            if(!atLeastOneInvaderAlive){
                return undefined;
            }

            return aabb;
        };

        function onInvaderDeath(){
            if(_numInvadersAlive === 1){
                _onAllInvadersDeadCb();
            }
            --(_numInvadersAlive);
        };

        function construct(){
            _numInvadersAlive = countInvaders(_invaders);
        };

        function onAllInvadersDead(cb){
            _onAllInvadersDeadCb = cb;
        }

        construct();

        return {
            destroy: destroy,
            onInvaderDeath: onInvaderDeath,
            onAllInvadersDead: onAllInvadersDead,
            update: update,
        };

    }(physicsEngine, invadersToControl));

    return invaderAI;
};
