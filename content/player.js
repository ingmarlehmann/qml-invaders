.import "constants.js" as Constants
.import "pubsub.js" as PS

function create(initialX, initialY, lives){
    var player = (function(initialX, initialY, lives){

        var _exports = {};

        var _position = { _x: initialX, _y: initialY };
        var _initialLives = lives;
        var _lives = lives;

        _exports.moveDir = Constants.MOVEDIR_NONE;

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

    }(initialX, initialY, lives));

    return player;
};
