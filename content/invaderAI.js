.import "constants.js" as Constants
.import "pubsub.js" as PS

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

function createInvaderAI(invadersToControl){
    var invaderAI = (function(invadersToControl){

        var _exports = {};

        var _moveDir = Constants.MOVEDIR_RIGHT;

        var _moveTimer = 0;
        var _moveInterval = 5000;
        var _timeElapsed = 0;

        _exports.update = function(deltaTime){
            _timeElapsed += deltaTime;

            // Time to move pack?
            if((_moveTimer + _moveInterval) >= _timeElapsed){
                _moveTimer = _timeElapsed;

                // If moveDir is LEFT or RIGHT, move until an edge is hit.
                if(_moveDir === Constants.MOVEDIR_RIGHT || _moveDir === Constants.MOVEDIR_LEFT){
                    // Try moving in the set move direction.
                    if(!_move(_moveDir)){
                        // The move failed, we hit a wall, change move direction.
                        if(_moveDir === Constants.MOVEDIR_RIGHT){
                            _moveDir = Constants.MOVEDIR_DOWN;
                            if(!_move(_moveDir)){
                                console.log("ERROR; Can't move invader pack");
                            }
                        }
                        else if(_moveDir === Constants.MOVEDIR_DOWN){
                            _moveDir = Constants.MOVEDIR_LEFT;
                            if(!_move(_moveDir)){
                                console.log("ERROR; Can't move invader pack");
                            }
                        }
                        else if(_moveDir === Constants.MOVEDIR_LEFT){
                            _moveDir = Constants.MOVEDIR_DOWN;
                            if(!_move(_moveDir)){
                                console.log("ERROR; Can't move invader pack");
                            }
                        }
                    }
                }
                else if(_moveDir === Constants.MOVEDIR_DOWN){

                }
            }
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
            return false;
        }
        var _moveLeft = function(){
            return false;
        }
        var _moveDown = function(){
            return false;
        }

        _exports.setPosition = function(x, y){

            _position._x = x;
            _position._y = y;

            PS.PubSub.publish(Constants.TOPIC_PLAYER_POSITION, { x: _position._x, y: _position._y });
        }

        _exports.setX = function(x){

            _position._x = x;

            PS.PubSub.publish(Constants.TOPIC_PLAYER_POSITION, { x: _position._x, y: _position._y });
        }

        _exports.setY = function(y){

            _position._y = y;

            PS.PubSub.publish(Constants.TOPIC_PLAYER_POSITION, { x: _position._x, y: _position._y });
        }

        // Return a copy of the position object so
        // that the original can not be modified.
        _exports.getPosition = function(){
            return { x: _position._x, y: _position._y };
        }

        _exports.hit = function(lives){
            setLives(getLives()-lives);
            PS.PubSub.publish(Constants.TOPIC_PLAYER_HIT, lives);
        }

        _exports.isDead = function(){
            return (_lives <= 0);
        }

        _exports.respawn = function(){
            setLives(_initialLives);
            PS.PubSub.publish(Constants.TOPIC_PLAYER_RESPAWNED, 1);
        }

        _exports.getLives = function(){
            return _lives;
        }

        var setLives = function(lives){
            _lives = lives;

            if(_lives <= 0){
                PS.PubSub.publish(Constants.TOPIC_PLAYER_DIED, 1);
            }
        }


        return _exports;

    }(invadersToControl));

    return invaderAI;
};
