
function create(x, y) {

    var vector2d = (function(x, y){

        var _x;
        var _y;

        function construct(x, y){
          if(x !== undefined && x !== null){
              _x = x;
          }
          else{
              _x = 0.0;
          }

          if(y !== undefined && y !== null){
              _y = y;
          }
          else{
              _y = 0.0;
          }
        }

        construct(x, y);

        return {
          x: _x,
          y: _y
        };

    }(x, y));

    return vector2d;
}
