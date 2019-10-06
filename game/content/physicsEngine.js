
function create(){
    var engine = (function(){

        // ----------------
        // Private variables
        // ----------------
        var _physicsObjects = [];
        var _physicsDebugBoxes = [];
        var _physicsDebugActive = false;

        var _objAIndex = 0;
        var _objBIndex = 0;
        var _groupIndex = 0;

        // ----------------
        // Public methods
        // ----------------
        function destroy(){
            clearPhysicsDebugBoxes();
        };

        function getPhysicsObject(index){
            return _objects[index];
        };

        function registerPhysicsObject(physicsObject){
            _physicsObjects.push(physicsObject);
            if(_physicsDebugActive){
                createPhysicsDebugBox(physicsObject);
            }
        };

        function update(){
            if(_physicsDebugActive){
                updatePhysicsDebugBoxes();
            }

            clearCollisionEvents();
            doCollisionTests();
            deleteDeadObjects();
        };

        function togglePhysicsDebug(){
            var i;

            if(_physicsDebugActive){
                clearPhysicsDebugBoxes();
                _physicsDebugActive = false;
                return;
            }

            for(i=0; i< _physicsObjects.length; ++i){
                createPhysicsDebugBox(_physicsObjects[i]);
            }

            _physicsDebugActive = true;
        };

        // ----------------
        // Private methods
        // ----------------
        function createPhysicsDebugBox(physicsObject){
            var callback, options;

            var x = physicsObject.physicsBody.getPosition().getX();
            var y = physicsObject.physicsBody.getPosition().getY();
            var width = physicsObject.physicsBody.getWidth();
            var height = physicsObject.physicsBody.getHeight();

            callback = function(qmlobject){
                // Also save a reference to the parent physics object so
                // we can update the position later during runtime.
                _physicsDebugBoxes.push({
                    view: qmlobject,
                    physicsBody: physicsObject.physicsBody });
            }

            options = { qmlfile: 'PhysicsDebugBox.qml',
                        qmlparameters: {
                            x: x,
                            y: y,
                            width: width,
                            height: height
                            }
                        };

            ObjectFactory.createObject(options, callback);
        };

        function clearPhysicsDebugBoxes(){
            var i;

            for(i=0; i< _physicsDebugBoxes.length; ++i){
                _physicsDebugBoxes[i].view.destroy();
            }
            _physicsDebugBoxes = [];
        };

        function updatePhysicsDebugBoxes(){
            var i;

            // Update physics debug shapes so they move together with
            // the view objects.
            for(i=0; i< _physicsDebugBoxes.length; ++i){
                _physicsDebugBoxes[i].view.x =
                        _physicsDebugBoxes[i].physicsBody.getPosition().getX();

                _physicsDebugBoxes[i].view.y =
                        _physicsDebugBoxes[i].physicsBody.getPosition().getY();
            }
        };

        function deleteDeadObjects(){
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
        };

        function clearCollisionEvents(){
            var i;
            for(i=0; i< _physicsObjects.length; ++i){
                _physicsObjects[i].collisionEventOccurred = false;
            }
        };

        function doCollisionTests(){

            var numPhysicsObjects = _physicsObjects.length;
            var numCollisionGroupsObjA;
            var physicsObjectA, physicsObjectB;

            // for each physics object
            for(_objAIndex=0;
                _objAIndex< numPhysicsObjects;
                ++_objAIndex)
            {
                numCollisionGroupsObjA = (_physicsObjects[_objAIndex]).testCollisionsAgainst.length;
                physicsObjectA = _physicsObjects[_objAIndex];

                // for each group of other physics objects to be tested against.
                for(_groupIndex=0;
                    _groupIndex < numCollisionGroupsObjA;
                    ++_groupIndex)
                {
                    // for each physics object
                    for(_objBIndex=0;
                        _objBIndex < numPhysicsObjects;
                        ++_objBIndex)
                    {
                        physicsObjectB = _physicsObjects[_objBIndex];

                        // if objB is not a member of one of the groups to test
                        // collisions against, continue.
                        if(physicsObjectA.testCollisionsAgainst[_groupIndex]
                                !== physicsObjectB.collisionGroup)
                        {
                            continue;
                        }

                        // Did one of the objects already collide with something this frame?
                        // If so, skip.
                        if(physicsObjectA.collisionEventOccurred === true
                                || physicsObjectB.collisionEventOccurred === true)
                        {
                            continue;   // dont test B vs A if A vs B was already tested.
                                        // this lazy implementation disables multiple collisions but
                                        // it is an ok limitation for this game.
                        }

                        var doesCollide = collides(physicsObjectA.physicsBody,
                                                 physicsObjectB.physicsBody);
                        if(doesCollide){
                            physicsObjectA.collisionEventOccurred = true;
                            physicsObjectB.collisionEventOccurred = true;

                            physicsObjectA.collisionCallback(
                                        physicsObjectB.collisionGroup);

                            physicsObjectB.collisionCallback(
                                        physicsObjectA.collisionGroup);
                        }
                    }
                }
            }
        };

        function collides(physicsObject1, physicsObject2){
            if(physicsObject1.getType() === 'aabb' &&
                    physicsObject2.getType() === 'aabb'){
                return testAABBvsAABB(physicsObject1, physicsObject2);
            }

            return undefined;
        };

        var testAABBvsAABB = function(a, b){
            if (a.getMax().getX() < b.getMin().getX())
                return false; // a is left of b
            if (a.getMin().getX() > b.getMax().getX())
                return false; // a is right of b
            if (a.getMax().getY() < b.getMin().getY())
                return false; // a is above b
            if (a.getMin().getY() > b.getMax().getY())
                return false; // a is below b

            return true;
        };

        return{
            destroy: destroy,
            getPhysicsObject: getPhysicsObject,
            registerPhysicsObject: registerPhysicsObject,
            togglePhysicsDebug: togglePhysicsDebug,
            update: update
        };

    }());

    return engine;
}

