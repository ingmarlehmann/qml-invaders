
function create(){

    var engine = (function(){

        var _exports = {};
        var _physicsObjects = [];

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

        _exports.registerPhysicsObject = function(physicsObject){
            //console.log("INFO: Registering physics object in collision group: " + physicsObject.collisionGroup);
            _physicsObjects.push(physicsObject);
        };

        _exports.clear = function(){
            _physicsObjects = [];
        }

        _exports.step = function(){

        };


        return _exports;
    }());

    return engine;
}

