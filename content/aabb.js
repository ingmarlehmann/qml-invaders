.import "vector2d.js" as Vector2d

function create(width, height, position) {

    var aabb = (function(width, height, position){

        var _exports = {};

        var _min = Vector2d.create(0, 0);
        var _max = Vector2d.create(0, 0);

        var _width = width;
        var _height = height;
        var _position = position;

        _exports.setPosition = function(x, y){
            _position = Vector2d.create(x, y);

            _min = Vector2d.create(x, y);
            _max = Vector2d.create(x + width, y + height);
        }

        _exports.setX = function(x){
            _position.x = x;
        }

        _exports.setY = function(y){
            _position.y = y;
        }

        _exports.getPosition = function(){
            return { x: _position.x, y: _position.y };
        }

        _exports.getMin = function(){
            return _min;
        }

        _exports.getMax = function(){
            return _max;
        }

        _exports.setWidth = function(width){
            _width = width;
            _max = Vector2d.create(_position.x + width, _position.y + height);
        }

        _exports.setHeight = function(height){
            _height = height;
            _max = Vector2d.create(_position.x + width, _position.y + height);
        }

        _exports.getWidth = function(){
            return _width;
        }

        _exports.getHeight = function(){
            return _height;
        }

        if(position !== "undefined" && position !== null){
            _exports.setPosition(position);
        }
        else{
            _exports.setPosition(Vector2d.create(0, 0));
        }

        return _exports;

    }(width, height, position));

    return aabb;
}

