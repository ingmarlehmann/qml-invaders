
function create(options) {

    var vector2d = (function(x, y){

        var _exports = {};

        if(x !== undefined && x !== null){
            _exports.x = x;
        }
        else{
            _exports.x = 0;
        }

        if(y !== undefined && y !== null){
            _exports.y = y;
        }
        else{
            _exports.y = 0;
        }

        return _exports;

    }(x, y));

    return vector2d;
}

