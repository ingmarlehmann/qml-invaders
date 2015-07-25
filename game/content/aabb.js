.import "vector2d.js" as Vector2d

function create(width, height, position) {

    var aabb = (function(width, height, position){

        var _min = Vector2d.create(0, 0);
        var _max = Vector2d.create(0, 0);

        var _width;
        var _height;
        var _position;

        function updateMinMax(){
            _min = Vector2d.create(_position.x, _position.y);
            _max = Vector2d.create(_position.x + _width, _position.y + _height);
        }

        function setPosition(x, y){
            _position = Vector2d.create(x, y);
            updateMinMax();
        }

        function setX(x){
            _position.x = x;
            updateMinMax();
        }

        function setY(y){
            _position.y = y;
            updateMinMax();
        }

        function getX(){
            return _position.x;
        }

        function getY(){
            return _position.y;
        }

        function merge(aabb){
            var ret = create(_width, _height, _position);

            var min = Vector2d.create(
              Math.min(aabb.getMin().x, ret.getMin().x),
              Math.min(aabb.getMin().y, ret.getMin().y)
            );

            var max = Vector2d.create(
              Math.max(aabb.getMax().x, ret.getMax().x),
              Math.max(aabb.getMax().y, ret.getMax().y)
            );

            ret.setMin(min);
            ret.setMax(max);
            ret.setWidth(Math.abs(max.x - min.x));
            ret.setHeight(Math.abs(max.y - min.y));

            return ret;
        }

        function getPosition(){
            return { x: _position.x, y: _position.y };
        }

        function getMin(){
            return _min;
        }

        function getMax(){
            return _max;
        }

        function setMin(min){
            _min = min;
            updateMinMax();
        }

        function setMax(max){
            _max = max;
            updateMinMax();
        }

        function setWidth(width){
            _width = width;
            updateMinMax();
        }

        function setHeight(height){
            _height = height;
            updateMinMax();
        }

        function getWidth(){
            return _width;
        }

        function getHeight(){
            return _height;
        }

        function getType(){
          return 'aabb';
        }

        function construct(){
            if(position !== undefined && position !== null){
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

            updateMinMax();
        }

        construct();

        return {
            // Public methods:
            getPosition: getPosition,
            setPosition: setPosition,

            getX: getX,
            getY: getY,

            setX: setX,
            setY: setY,

            setMin: setMin,
            setMax: setMax,

            getMin: getMin,
            getMax: getMax,

            getWidth: getWidth,
            getHeight: getHeight,

            setWidth: setWidth,
            setHeight: setHeight,

            merge: merge,

            getType: getType
        };

    }(width, height, position));

    return aabb;
}
