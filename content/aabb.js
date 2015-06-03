.import "vector2d.js" as Vector2d

function create(options) {

    var aabb = (function(min, max){
        var _exports = {};

        if(options.min !== undefined && options.min !== null){
            _exports.min = options.min;
        }
        else{
            _exports.min = Vector2d.create(0, 0);
        }

        if(options.max !== undefined && options.max !== null){
            _exports.max = options.max;
        }
        else{
            _exports.max = Vector2d.create(0, 0);
        }

        return _exports;

    }(min, max));

    return aabb;
}

