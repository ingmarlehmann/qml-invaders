.import "constants.js" as Constants
.import "pubsub.js" as PS

function createEnemyShip(initialX, initialY, lives){
    var enemyShip = (function(initialX, initialY, lives){

        var _exports = {};

        var _position = { _x: initialX, _y: initialY };
        var _initialLives = lives;
        var _lives = lives;

        _exports.setPosition = function(x, y){

            _position._x = x;
            _position._y = y;
        }

        _exports.setX = function(x){

            _position._x = x;
        }

        _exports.setY = function(y){

            _position._y = y;
        }

        _exports.getPosition = function(){
            // Return a copy of the position object so
            // that the original can not be modified.
            return { x: _position._x, y: _position._y };
        }

        _exports.hit = function(lives){
            setLives(getLives()-lives);
        }

        _exports.isDead = function(){
            return (_lives <= 0);
        }

        _exports.respawn = function(){
            setLives(_initialLives);
        }

        _exports.getLives = function(){
            return _lives;
        }

        var setLives = function(lives){
            _lives = lives;
        }

        return _exports;

    }(initialX, initialY, lives));

    return enemyShip;
};
