.import "vector2d.js" as Vector2d

function create(width, height, position) {

    var aabb = (function(width, height, position){

        var _exports = {};

        // ----------------
        // Private variables
        // ----------------
        var _min = Vector2d.create(0, 0);
        var _max = Vector2d.create(0, 0);

        var _width = width;
        var _height = height;
        var _position = position;

        // ----------------
        // Private methods
        // ----------------
        var _updateMinMax = function(){
            _min = Vector2d.create(_position.x, _position.y);
            _max = Vector2d.create(_position.x + _width, _position.y + _height);
            _exports.min = _min;
            _exports.max = _max;
        }

        // ----------------
        // Public methods
        // ----------------
        _exports.setPosition = function(x, y){
            _position = Vector2d.create(x, y);
            _updateMinMax();
        }

        _exports.setX = function(x){
            _position.x = x;
            _updateMinMax();
        }

        _exports.setY = function(y){
            _position.y = y;
            _updateMinMax();
        }

        _exports.getX = function(){
            return _position.x;
        }

        _exports.getY = function(){
            return _position.y;
        }

        _exports.merge = function(aabb){
            _min.x = Math.min(aabb.min.x, _min.x);
            _max.x = Math.max(aabb.max.x, _max.x);
            _min.y = Math.min(aabb.min.y, _min.y);
            _max.y = Math.max(aabb.max.y, _max.y);

            _width = Math.abs(_max.x - _min.x);
            _height = Math.abs(_max.y - _min.y);

            return this;
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
            _updateMinMax();
        }

        _exports.setHeight = function(height){
            _height = height;
            _updateMinMax();
        }

        _exports.getWidth = function(){
            return _width;
        }

        _exports.getHeight = function(){
            return _height;
        }

        // ----------------
        // Public variables
        // ----------------
        _exports.type = 'aabb';
        _exports.max = _max;
        _exports.min = _min;

        // ----------------
        // Constructor
        // ----------------
        if(position !== "undefined" && position !== null){
            _position = position;
        }
        else{
            _position = Vector2d.create(0, 0);
        }

        if(width !== undefined && width !== null){
            _width = width;
        }
        else{
            _width = 0;
        }

        if(height !== undefined && height !== null){
            _height = height;
        }
        else{
            _height = 0;
        }

        _updateMinMax();

        // Return self
        return _exports;

    }(width, height, position));

    return aabb;
}

