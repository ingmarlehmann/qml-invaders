
function create(){

    var engine = (function(){

        var _exports = {};
        var _physicsObjects = [];
        var _physicsDebugBoxes = [];
        var _physicsDebugActive = false;

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
            console.log("INFO: Registering physics object in collision group: " + physicsObject.collisionGroup);
            _physicsObjects.push(physicsObject);
        };

        _exports.clear = function(){
            _physicsObjects = [];
        }

        _exports.togglePhysicsDebug = function(){
            var i, callback, options;

            if(_physicsDebugActive){
                for(i=0; i< _physicsDebugBoxes.length; ++i){
                    _physicsDebugBoxes[i].destroy();
                }
                _physicsDebugBoxes = [];
                _physicsDebugActive = false;

                return;
            }

            for(i=0; i< _physicsObjects.length; ++i){
                callback = function(qmlobject){
                    _physicsDebugBoxes.push(qmlobject);
                }

                options = { qmlfile: 'PhysicsDebugBox.qml',
                            qmlparameters: {
                                x: _physicsObjects[i].physicsBody.getPosition().x,
                                y: _physicsObjects[i].physicsBody.getPosition().y,
                                width: _physicsObjects[i].physicsBody.getWidth(),
                                height: _physicsObjects[i].physicsBody.getHeight()
                                }
                            };

                ObjectFactory.createObject(options, callback);
            }

            _physicsDebugActive = true;
        }

        _exports.update = function(){

        };


        return _exports;
    }());

    return engine;
}

