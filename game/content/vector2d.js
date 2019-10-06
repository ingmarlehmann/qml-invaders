
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
        }

        function setY(newY){
            _y = newY;
        }

        function toString(){
            return "(x: " + _x + ",y: " + _y + ")";
        };

        function construct(x, y){
          if(initialX){
              _x = initialX;
          }
          else{
              _x = 0.0;
          }

          if(initialY){
              _y = initialY;
          }
          else{
              _y = 0.0;
          }
        };

        construct(initialX, initialY);

        return {
          getX: getX,
          getY: getY,

          setX: setX,
          setY: setY,

          toString: toString
        };

    }(initialX, initialY));

    return vector2d;
}
