
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
            //console.log("DEBUG: Registering physics object in collision group: " + physicsObject.collisionGroup);
            _physicsObjects.push(physicsObject);
        };

        _exports.clear = function(){
            _physicsObjects = [];
        }

        _exports.togglePhysicsDebug = function(){
            var i, callback, options;

            if(_physicsDebugActive){
                for(i=0; i< _physicsDebugBoxes.length; ++i){
                    _physicsDebugBoxes[i].view.destroy();
                }
                _physicsDebugBoxes = [];
                _physicsDebugActive = false;

                return;
            }

            for(i=0; i< _physicsObjects.length; ++i){
                var x, y, width, height;

                x = _physicsObjects[i].physicsBody.getPosition().x;
                y = _physicsObjects[i].physicsBody.getPosition().y;
                width = _physicsObjects[i].physicsBody.getWidth();
                height = _physicsObjects[i].physicsBody.getHeight();

                callback = function(qmlobject){
                    //console.log("DEBUG: Physics debug object visible: " + qmlobject.visible);

                    // Also save a reference to the parent physics object so
                    // we can update the position later during runtime.
                    _physicsDebugBoxes.push({
                        view: qmlobject,
                        physicsBody: _physicsObjects[i].physicsBody });
                }

                //console.log("DEBUG: Creating physics debug box with properties " +
                //            "x: " + x + " y: " + y + " width: " + width +
                //            " height: " + height);

                options = { qmlfile: 'PhysicsDebugBox.qml',
                            qmlparameters: {
                                x: x,
                                y: y,
                                width: width,
                                height: height
                                }
                            };

                ObjectFactory.createObject(options, callback);
            }

            _physicsDebugActive = true;
        }

        _exports.update = function(){
            var i;

            // Update physics debug shapes so they move together with
            // the view objects.
            if(_physicsDebugActive){
                for(i=0; i< _physicsDebugBoxes.length; ++i){
                    _physicsDebugBoxes[i].view.x =
                            _physicsDebugBoxes[i].physicsBody.getPosition().x;

                    _physicsDebugBoxes[i].view.y =
                            _physicsDebugBoxes[i].physicsBody.getPosition().y;
                }
            }

            _doCollisionTests();
        };

        var _doCollisionTests = function(){
            var i, j, k;
            for(i=0; i< _physicsObjects.length; ++i){
                var myGroup = _physicsObjects[i].collisionGroup;
                var testAgainst = _physicsObjects[i].testCollisionsAgainst;

                for(j=0; j< _physicsObjects.length; ++j){
                    for(k=0; k< testAgainst.length; ++k){
                        if(testAgainst[k]
                                === _physicsObjects[j].collisionGroup){
                            if(_collides(
                                        _physicsObjects[i].physicsBody,
                                        _physicsObjects[j].physicsBody) === true){

                                //console.log("DEBUG: Object A: " + JSON.stringify(_physicsObjects[i]));
                                //console.log("DEBUG: Object B: " + JSON.stringify(_physicsObjects[j]));

                                _physicsObjects[i].collisionCallback(_physicsObjects[j].collisionGroup);
                                _physicsObjects[j].collisionCallback(_physicsObjects[i].collisionGroup);
                            }
                        }
                    }
                }
            }
        }

        var _collides = function(physicsObject1, physicsObject2){
            if(physicsObject1.type === 'aabb' &&
                    physicsObject2.type === 'aabb'){
                return _testAABBvsAABB(physicsObject1, physicsObject2);
            }

            return undefined;
        }

        var _testAABBvsAABB = function(a, b){
            //console.log("DEBUG: a min: x" + a.min.x + " y " + a.min.y);
            //console.log("DEBUG: a max: x" + a.max.x + " y " + a.max.y);
            //console.log("DEBUG: b min: x" + b.min.x + " y " + b.min.y);
            //console.log("DEBUG: b max: x" + b.max.x + " y " + b.max.y);

            if (a.max.x < b.min.x)
                return false; // a is left of b
            if (a.min.x > b.max.x)
                return false; // a is right of b
            if (a.max.y < b.min.y)
                return false; // a is above b
            if (a.min.y > b.max.y)
                return false; // a is below b

            return true;
        }

        return _exports;
    }());

    return engine;
}

