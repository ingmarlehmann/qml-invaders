.import "constants.js" as Constants
.import "pubsub.js" as PS

function createPlayer(initialX, initialY, lives){
    var player = (function(initialX, initialY, lives){

        var _exports = {};
        var _position = { _x: initialX, _y: initialY };
        var _lives = lives;
        var _positionObservers = [];

        _exports.moveDir = Constants.MOVEDIR_NONE;

        _exports.setPosition = function(x, y){
            _position._x = x;
            _position._y = y;

            for(var i=0; i< _positionObservers.length; ++i){
                _positionObservers[i]({ x: _position._x, y: _position._y });
            }
        }

        _exports.setX = function(x){
            _position._x = x;
            for(var i=0; i< _positionObservers.length; ++i){
                _positionObservers[i]({ x: _position._x, y: _position._y });
            }
        }

        _exports.setY = function(y){
            _position._y = y;
            for(var i=0; i< _positionObservers.length; ++i){
                _positionObservers[i]({ x: _position._x, y: _position._y });
            }
        }

        // Return a copy of the position object so
        // that the original can not be modified.
        _exports.getPosition = function(){
            return { x: _position._x, y: _position._y };
        }

        _exports.setLives = function(lives){
            _lives = lives;
        }

        _exports.registerPositionObserver = function(observer){
            _positionObservers.push(observer);
        }

        _exports.clearPositionObservers = function(observer){
           _positionObservers = [];
        }

        return _exports;
    }(initialX, initialY, lives));

    return player;
};
