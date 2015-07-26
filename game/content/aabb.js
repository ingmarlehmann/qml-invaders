.import "vector2d.js" as Vector2d

function create(width, height, position) {

    var aabb = (function(width, height, position){

        var _min;
        var _max;

        function setPosition(x, y){
            setX(x);
            setY(y);
        }

        function setX(x){
            var width = getWidth();
            _min.setX(x);
            _max.setX(x+width);
        }

        function setY(y){
            var height = getHeight();
            _min.setY(y);
            _max.setY(y+height);
        }

        function getX(){
            return _min.getX();
        }

        function getY(){
            return _min.getY();
        }

        function merge(aabb){

            // Create a copy of self
            var ret = create(getWidth(),
                             getHeight(),
                             getPosition());

            var min = Vector2d.create(
                        Math.min(aabb.getMin().getX(),
                                 ret.getMin().getX()),

                        Math.min(aabb.getMin().getY(),
                                 ret.getMin().getY())
                        );

            var max = Vector2d.create(
                        Math.max(aabb.getMax().getX(),
                                 ret.getMax().getX()),

                        Math.max(aabb.getMax().getY(),
                                 ret.getMax().getY())
                        );

            ret._setMin(min);
            ret._setMax(max);

            return ret;
        }

        function getPosition(){
            return Vector2d.create(_min.getX(), _min.getY());
        }

        function getMin(){
            return _min;
        }

        function getMax(){
            return _max;
        }

        function setMin(min){
            _min = Vector2d.create(min.getX(), min.getY());
        }

        function setMax(max){
            _max = Vector2d.create(max.getX(), max.getY());
        }

        function setWidth(width){
            _max.setX(_min.getX() + width);
        }

        function setHeight(height){
            _max.setY(_min.getY() + height);
        }

        function getWidth(){
            return Math.abs(_max.getX() - _min.getX());
        }

        function getHeight(){
            return Math.abs(_max.getY() - _min.getY());
        }

        function getType(){
          return 'aabb';
        }

        function toString(){
            return "aabb min: " + _min.toString() + " max: " + _max.toString()
                    + " width: " + getWidth() + " height: " + getHeight();
        }

        function construct(){
            if(position !== undefined && position !== null){
                _min = Vector2d.create(position.getX(), position.getY());
            }
            else{
                _min = Vector2d.create(0, 0);
            }

            if(width !== undefined && width !== null){
                _max = Vector2d.create(_min.getX() + width, _min.getY());
            }
            else{
                _max = Vector2d.create(_min.getX(), _min.getY());
            }

            if(height !== undefined && height !== null){
                _max.setY(_min.getY() + height);
            }
        }

        construct();

        return {
            // Internal methods:
            _setMin: setMin,
            _setMax: setMax,

            _setWidth: setWidth,
            _setHeight: setHeight,

            // Public methods:
            getPosition: getPosition,
            setPosition: setPosition,

            getX: getX,
            getY: getY,

            setX: setX,
            setY: setY,

            getMin: getMin,
            getMax: getMax,

            getWidth: getWidth,
            getHeight: getHeight,

            merge: merge,

            toString: toString,

            getType: getType
        };

    }(width, height, position));

    return aabb;
}
