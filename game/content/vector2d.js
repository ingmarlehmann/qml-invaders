
function create(initialX, initialY) {

    var vector2d = (function(initialX, initialY){

        var _x;
        var _y;

        function getX(){
            return _x;
        }

        function getY(){
            return _y;
        }

        function setX(newX){
            _x = newX;
            //console.log("Vector2d: setting x to: " + newX);
        }

        function setY(newY){
            _y = newY;
            //console.log("Vector2d: setting y to: " + newY);
        }

        function toString(){
            return "(x: " + _x + ",y: " + _y + ")";
        };

        function construct(x, y){
          if(initialX !== undefined && initialX !== null){
              _x = initialX;
          }
          else{
              _x = 0.0;
          }

          if(initialY !== undefined && initialY !== null){
              _y = initialY;
          }
          else{
              _y = 0.0;
          }
        };

        construct(initialX, initialY);

        return {
//          x: _x,
//          y: _y,

          getX: getX,
          getY: getY,

          setX: setX,
          setY: setY,

          toString: toString
        };

    }(initialX, initialY));

    return vector2d;
}
