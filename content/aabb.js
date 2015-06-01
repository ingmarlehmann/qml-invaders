
function create(options) {
    var aabb = (function(options){
        var _exports = {};

        if(options.x_max !== undefined && options.x_max !== null){
            _exports.x_max = options.x_max;
        }

        if(options.x_min !== undefined && options.x_min !== null){
            _exports.x_min = options.x_min;
        }

        if(options.y_max !== undefined && options.y_max !== null){
            _exports.y_max = options.y_max;
        }

        if(options.y_min !== undefined && options.y_min !== null){
            _exports.y_min = options.y_min;
        }

        return _exports;
    }(options));

    return aabb;
}

