
function create(){

    var engine = (function(){

        var _exports = {};

        // ----------------
        // Private variables
        // ----------------
        var _physicsObjects = [];
        var _physicsDebugBoxes = [];
        var _physicsDebugActive = false;

        // ----------------
        // Public methods
        // ----------------
        _exports.applyVisitor = function(visitor){
            var i;
            for(i=0;i<_objects.length; ++i){
                visitor(_objects[i]);
            }

            return _objects;
        }

        _exports.destroy = function(){
            _clearPhysicsDebugBoxes();
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
                _physicsDebugActive = false;
                return;
            }

            for(i=0; i< _physicsObjects.length; ++i){
                _createPhysicsDebugBox(_physicsObjects[i]);
            }

            _physicsDebugActive = true;
        }

        // ----------------
        // Private methods
        // ----------------
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
        var _doCollisionTests = function()
        {
            var objA, objB, groupIndex;

            // for each physics object
            for(objA=0;
                objA< _physicsObjects.length;
                ++objA)
            {
                // for each group of other physics objects to be tested against.
                for(groupIndex=0;
                    groupIndex < (_physicsObjects[objA]).testCollisionsAgainst.length;
                    ++groupIndex)
                {
                    // for each physics object
                    for(objB=0;
                        objB < _physicsObjects.length;
                        ++objB)
                    {
                        // if objB is not a member of one of the groups to test
                        // collisions against, continue.
                        if(_physicsObjects[objA].testCollisionsAgainst[groupIndex]
                                !== _physicsObjects[objB].collisionGroup)
                        {
                            continue;
                        }

                        // Did one of the objects already collide with something this frame?
                        // If so, skip.
                        if(_physicsObjects[objA].collisionEventOccurred === true
                                || _physicsObjects[objB].collisionEventOccurred === true)
                        {
                            continue;   // dont test B vs A if A vs B was already tested.
                                        // this lazy implementation disables multiple collisions but
                                        // it is an ok limitation for this game.
                        }

                        var collides = _collides(_physicsObjects[objA].physicsBody,
                                                 _physicsObjects[objB].physicsBody);
                        if(collides){
                            _physicsObjects[objA].collisionEventOccurred = true;
                            _physicsObjects[objB].collisionEventOccurred = true;

                            _physicsObjects[objA].collisionCallback(
                                        _physicsObjects[objB].collisionGroup);

                            _physicsObjects[objB].collisionCallback(
                                        _physicsObjects[objA].collisionGroup);
                        }
                    }
                }
            }
        }

        var _collides = function(physicsObject1, physicsObject2){
            if(physicsObject1.getType() === 'aabb' &&
                    physicsObject2.getType() === 'aabb'){
                return _testAABBvsAABB(physicsObject1, physicsObject2);
            }

            return undefined;
        }

        var _testAABBvsAABB = function(a, b){
            //console.log("DEBUG: a min: x" + a.min.x + " y " + a.min.y);
            //console.log("DEBUG: a max: x" + a.max.x + " y " + a.max.y);
            //console.log("DEBUG: b min: x" + b.min.x + " y " + b.min.y);
            //console.log("DEBUG: b max: x" + b.max.x + " y " + b.max.y);

            if (a.getMax().x < b.getMin().x)
                return false; // a is left of b
            if (a.getMin().x > b.getMax().x)
                return false; // a is right of b
            if (a.getMax().y < b.getMin().y)
                return false; // a is above b
            if (a.getMin().y > b.getMax().y)
                return false; // a is below b

            return true;
        }

        return _exports;
    }());

    return engine;
}

