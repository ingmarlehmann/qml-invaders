
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

            if(_physicsDebugActive){
                _createPhysicsDebugBox(physicsObject);
            }
        };

        _exports.clear = function(){
            _physicsObjects = [];
        }

        _exports.update = function(){
            if(_physicsDebugActive){
                _updatePhysicsDebugBoxes();
            }

            _clearCollisionEvents();
            _doCollisionTests();
            _deleteDeadObjects();
        };

        _exports.togglePhysicsDebug = function(){
            var i;

            if(_physicsDebugActive){
                _clearPhysicsDebugBoxes();
                return;
            }

            for(i=0; i< _physicsObjects.length; ++i){
                _createPhysicsDebugBox(_physicsObjects[i]);
            }

            _physicsDebugActive = true;
        }

        var _createPhysicsDebugBox = function(physicsObject){
            var callback, options;

            var x = physicsObject.physicsBody.getPosition().x;
            var y = physicsObject.physicsBody.getPosition().y;
            var width = physicsObject.physicsBody.getWidth();
            var height = physicsObject.physicsBody.getHeight();

            callback = function(qmlobject){
                //console.log("DEBUG: Physics debug object visible: " + qmlobject.visible);

                // Also save a reference to the parent physics object so
                // we can update the position later during runtime.
                _physicsDebugBoxes.push({
                    view: qmlobject,
                    physicsBody: physicsObject.physicsBody });
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

        var _clearPhysicsDebugBoxes = function(){
            var i;

            for(i=0; i< _physicsDebugBoxes.length; ++i){
                _physicsDebugBoxes[i].view.destroy();
            }
            _physicsDebugBoxes = [];
            _physicsDebugActive = false;
        }

        var _updatePhysicsDebugBoxes = function(){
            var i;

            // Update physics debug shapes so they move together with
            // the view objects.
            for(i=0; i< _physicsDebugBoxes.length; ++i){
                _physicsDebugBoxes[i].view.x =
                        _physicsDebugBoxes[i].physicsBody.getPosition().x;

                _physicsDebugBoxes[i].view.y =
                        _physicsDebugBoxes[i].physicsBody.getPosition().y;
            }
        }

        var _deleteDeadObjects = function(){
            var i;

            // Destroy objects marked for deletion.
            for(i=(_physicsObjects.length-1); i >= 0; --i){
                if(_physicsObjects[i].isToBeDeleted()){
                    _physicsObjects.splice(i, 1);
                    if(_physicsDebugActive){
                        _physicsDebugBoxes[i].view.destroy();
                        _physicsDebugBoxes.splice(i, 1);
                    }
                }
            }
        }

        var _clearCollisionEvents = function(){
            var i;
            for(i=0; i< _physicsObjects.length; ++i){
                _physicsObjects[i].collisionEventOccurred = false;
            }
        }

        // TODO: rewrite this slow shit code!
        var _doCollisionTests = function(){
            var i, j, k;
            for(i=0; i< _physicsObjects.length; ++i){
                var myGroup = _physicsObjects[i].collisionGroup;
                var testAgainst = _physicsObjects[i].testCollisionsAgainst;

                for(j=0; j< _physicsObjects.length; ++j){
                    for(k=0; k< testAgainst.length; ++k){
                        if(_physicsObjects[i].collisionEventOccurred === true
                                || _physicsObjects[j].collisionEventOccurred === true){
                            //console.log("skipping collision test of " + i + " vs " + j + ". object has already collided.")
                            continue;   // dont test B vs A if A vs B was already tested.
                                        // this lazy implementation disables multiple collisions but
                                        // it is an ok limitation for this game.
                        }

                        if(testAgainst[k]
                                === _physicsObjects[j].collisionGroup){
                            if(_collides(
                                        _physicsObjects[i].physicsBody,
                                        _physicsObjects[j].physicsBody) === true){

                                //console.log("Collision: Object A: " + i + " object B: " + j);

                                _physicsObjects[i].collisionEventOccurred = true;
                                _physicsObjects[j].collisionEventOccurred = true;

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

