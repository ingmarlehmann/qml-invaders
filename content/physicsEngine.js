function create(){

    var engine = (function(){

        var _exports = {};
        var _objects = [];

        _exports.createAABB = function(){
            var _aabb = {};
            _aabb.x = 0;
            _aabb.y = 0;
            _aabb.width = 0;
            _aabb.height = 0;

            return 0;
        };

        _exports.applyVisitor = function(visitor){
            var i;
            for(i=0;i<_objects.length; ++i){
                visitor(_objects[i]);
            }

            return _objects;
        }

        _exports.getPhysicsObject = function(index){
            return _objects[index];
        }

        _exports.registerPhysicsBody = function(physicsObject){
            _objects.push(physicsObject);
        };

        _exports.step = function(){

        };


        return _exports;
    }());

    return engine;
}

