.import "constants.js" as Constants
.import "pubsub.js" as PS
.import "objectFactory.js" as ObjectFactory

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

function createInvaderAI(qmlCanvasParent, invadersToControl){
    var invaderAI = (function(qmlCanvasParent, invadersToControl){

        var _exports = {};

        var _moveDir = Constants.MOVEDIR_RIGHT;
        var _prevMoveDir = Constants.MOVEDIR_LEFT;

        var _moveTimer = 0;
        var _moveInterval = 5000;

        var _shootTimer = 0;
        var _shootInterval = 2000;

        var _timeElapsed = 0;

        var _invaders = invadersToControl;

        var _enemyProjectiles = [];

        var _rootObject = qmlCanvasParent;

        var _objectFactory = null;

        // Clean up all data created by InvaderAI.
        // Always call this method before releasing the InvaderAI object.
        _exports.destroy = function(){
            var i;

            for(i=0; i< _enemyProjectiles.length; ++i){
                _enemyProjectiles[i].destroy();
            }
        }

        // Set the object factory used for creating game objects
        // such as enemy ships and enemy projectiles.
        _exports.setObjectFactory = function(factory){
            _objectFactory = factory;
        }

        // Update the InvaderAI one step.
        _exports.update = function(deltaTime){
            var i;

            _timeElapsed += deltaTime;

            // Time to move pack?
            if((_moveTimer + _moveInterval) <= _timeElapsed){
                _moveTimer = _timeElapsed;

                _moveInvaderPack();
            }

            if((_shootTimer + _shootInterval) <= _timeElapsed){
                _shootTimer = _timeElapsed;

                _fireInvaderWeaponSystems();
            }

            // update enemy projectile movements.
            for(i=0; i< _enemyProjectiles.length; ++i){
                _enemyProjectiles[i].y = Math.max(0, _enemyProjectiles[i].y + (Constants.ENEMY_PROJECTILE_SPEED * deltaTime));
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
                for(row=Constants.INVADER_ROWS-1; row>= 0; --row){
                    if(_invaders[row][column].visible){
                        bottomInvaders.push(_invaders[row][column]);
                        break;
                    }
                }
            }

            // Choose one invader at random out of the bottom invaders
            // that will fire a missile towards the player.
            randomInvader = bottomInvaders[Math.floor(Math.random() * bottomInvaders.length)];

            PS.PubSub.publish(Constants.TOPIC_ENEMY_FIRED, 0);

            createEnemyProjectile(qmlCanvasParent,
                                  randomInvader.x + (Constants.ENEMYSHIP_WIDTH/2),
                                  randomInvader.y + (Constants.ENEMYSHIP_HEIGHT));
        }

        // Access level: Private
        // Description: Create a new projectile.
        var createEnemyProjectile = function(objectParent, positionX, positionY){
            var objectName = "enemyProjectile";
            var completedCallback = function(newObject) {
                if(newObject) {
                    _enemyProjectiles.push(newObject);
                } else {
                    console.log("error creating object" + objectName);
                }
            }

            _objectFactory.createObject( objectName,
                         { x: positionX, y: positionY },
                         objectParent, // object parent
                         completedCallback );
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

            var bb = _getInvaderPackBoundingBox();
            if(bb.maxX + 5 >= 690){
                return false;
            }

            for(row=0; row< _invaders.length; ++row){
                for(column=0; column< _invaders[row].length; ++column){
                    _invaders[row][column].x += Constants.ENEMYSHIP_WIDTH;
                }
            }

            return true;
        }
        var _moveLeft = function(){
            var column = 0, row = 0;

            var bb = _getInvaderPackBoundingBox();
            if(Math.max(0, bb.minX - 5) === 0){
                return false;
            }

            for(row=0; row< _invaders.length; ++row){
                for(column=0; column< _invaders[row].length; ++column){
                    _invaders[row][column].x -= Constants.ENEMYSHIP_WIDTH;
                }
            }

            return true;
        }
        var _moveDown = function(){
            var column = 0, row = 0;

            for(row=0; row< _invaders.length; ++row){
                for(column=0; column< _invaders[row].length; ++column){
                    _invaders[row][column].y += Constants.ENEMYSHIP_HEIGHT;
                }
            }

            return true;
        }

        var _getInvaderPackBoundingBox = function(){
            var bb = {
                minX:999999,
                maxX:0,
                minY:999999,
                maxY:0
            };

            var row, column;
            var atLeastOneInvaderAlive = false;

            for(row=0; row< _invaders.length; ++row){
                for(column=0; column< _invaders[row].length; ++column){
                    if(_invaders[row][column].visible !== false){
                        atLeastOneInvaderAlive = true;

                        if(_invaders[row][column].x < bb.minX){
                            bb.minX = _invaders[row][column].x;
                        }
                        else if(_invaders[row][column].x > bb.maxX){
                            bb.maxX = _invaders[row][column].x;
                        }

                        if(_invaders[row][column].y < bb.minY){
                            bb.minY = _invaders[row][column].y;
                        }
                        else if(_invaders[row][column].y > bb.maxY){
                            bb.maxY = _invaders[row][column].y;
                        }
                    }
                }
            }

            if(!atLeastOneInvaderAlive){
                return {};
            }

            bb.maxX += Constants.ENEMYSHIP_WIDTH;
            bb.maxY += Constants.ENEMYSHIP_HEIGHT;

            return bb;
        }

        return _exports;

    }(qmlCanvasParent, invadersToControl));

    return invaderAI;
};