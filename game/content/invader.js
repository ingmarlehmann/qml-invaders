.import "vector2d.js" as Vector2d
.import "objectFactory.js" as ObjectFactory
.import "invaderPhysicsModel.js" as InvaderPhysicsModel
.import "pubsub.js" as PS
.import "constants.js" as Constants

function create(options, doneCallback) {

    var _invader = (function(options, doneCallback){

        // ----------------
        // Private variables
        // ----------------
        var _physicsModel = null;
        var _view = null;
        var _deleteMe = false;

        // ----------------
        // Public methods
        // ----------------
        function deleteLater(){
            _physicsModel.deleteLater();
            _deleteMe = true;
        }

        function isToBeDeleted(){
            return _deleteMe;
        }

        function setPosition(x, y){
            if(_physicsModel !== null && _physicsModel !== undefined){
                _physicsModel.physicsBody.setPosition(x, y);
            }
            else {
                console.log("Error: No physics model created for invader. Can't set position for physics model.");
            }

            if(_view !== null && _view !== undefined){
                _view.x = x;
                _view.y = y;
            }
            else{
                console.log("Error: No view created for invader. Can't set position for view.");
            }

            //PS.PubSub.publish(Constants.TOPIC_invader_POSITION, { x: _position._x, y: _position._y });
        }

        function setX(x){
            if(_physicsModel !== null && _physicsModel !== undefined){
                _physicsModel.physicsBody.setX(x);
            }
            else {
                console.log("Error: No physics model created for invader. Can't set position for physics model.");
            }

            if(_view !== null && _view !== undefined){
                _view.x = x;
            }
            else{
                console.log("Error: No view created for invader. Can't set position for view.");
            }

            //PS.PubSub.publish(Constants.TOPIC_invader_POSITION, { x: _position._x, y: _position._y });
        }

        function setY(y){
            if(_physicsModel !== null && _physicsModel !== undefined){
                _physicsModel.physicsBody.setY(y);
            }
            else {
                console.log("Error: No physics model created for invader. Can't set position for physics model.");
            }

            if(_view !== null && _view !== undefined){
                _view.y = y;
            }
            else{
                console.log("Error: No view created for invader. Can't set position for view.");
            }

            //PS.PubSub.publish(Constants.TOPIC_invader_POSITION, { x: _position._x, y: _position._y });
        }

        function appendX(x){
            if(_physicsModel !== null && _physicsModel !== undefined){
                _physicsModel.physicsBody.setX(_physicsModel.physicsBody.getX() + x);
            }
            else {
                console.log("Error: No physics model created for invader. Can't set position for physics model.");
            }

            if(_view !== null && _view !== undefined){
                _view.x = _physicsModel.physicsBody.getX();
            }
            else{
                console.log("Error: No view created for invader. Can't set position for view.");
            }

            //PS.PubSub.publish(Constants.TOPIC_invader_POSITION, { x: _position._x, y: _position._y });
        }

        function appendY(y){
            if(_physicsModel !== null && _physicsModel !== undefined){
                _physicsModel.physicsBody.setY(_physicsModel.physicsBody.getY() + y);
            }
            else {
                console.log("Error: No physics model created for invader. Can't set position for physics model.");
            }

            if(_view !== null && _view !== undefined){
                _view.y = _physicsModel.physicsBody.getY();
            }
            else{
                console.log("Error: No view created for invader. Can't set position for view.");
            }

            //PS.PubSub.publish(Constants.TOPIC_invader_POSITION, { x: _position._x, y: _position._y });
        }

        // Return a copy of the position object so
        // that the original can not be modified.
        function getPosition(){
            if(_physicsModel === null || _physicsModel === undefined){
                console.log("Error: No physics model created for invader. Can't get position.");
                return null;
            }

            return _physicsModel.physicsBody.getPosition();
        }

        // ----------------
        // Private methods
        // ----------------
        function onCollision(collidingObject){
            //console.log("DEBUG: Invader was hit by '" + collidingObject + "'");

            PS.PubSub.publish(Constants.TOPIC_INVADER_DIED, null);

            animateExplosion();
            deleteLater();
        }

        function animateExplosion(){
            function onExplosionAnimationCreated(object){
                if(object === undefined || object === null){
                    console.log("failed to spawn explosion!");
                }
            }

            var pos = _physicsModel.physicsBody.getPosition();

            var options = { qmlfile: 'Explosion.qml',
                            qmlparameters: { x: pos.getX(), y: pos.getY() } };

            ObjectFactory.createObject(options, onExplosionAnimationCreated);
        }

        function onViewObjectCreated(object){
            if(object === null || object === undefined){
                console.log("Error: Failed to create View object for invader.");
                doneCallback(null);
                return;
            }

            _view = object;
            createPhysicsModel();
        }

        function createPhysicsModel(){
            _physicsModel = InvaderPhysicsModel.create(_view.width, _view.height, onCollision);

            if(_physicsModel === null || _physicsModel === undefined){
                console.log("Error: Failed to create Physics model for invader.");
                doneCallback(null);
                return;
            }

            _physicsModel.physicsBody.setPosition(_view.x, _view.y);

            onFinishedCreation();
        }

        function onFinishedCreation(){
            doneCallback(publicInvaderInterface());
        }

        // ----------------
        // Constructor
        // ----------------
        function construct(options){
            var texture;
            if(options.invadertype === 'invader1'){
                texture = 'qrc:/content/images/invader1.png';
            }
            else if(options.invadertype === 'invader2'){
                texture = 'qrc:/content/images/invader2.png';
            }
            else if(options.invadertype === 'invader3'){
                texture = 'qrc:/content/images/invader3.png';
            }
            else{
                console.log("Error: options.invadertype not set, aborting creation.");
            }

            var createOptions = { qmlfile: 'EnemyShip.qml',
                            qmlparameters: { x: options.x, y: options.y },
                            qmlpostparameters: { source: texture } };

            ObjectFactory.createObject(createOptions, onViewObjectCreated);
        };

        // Run constructor
        construct(options);

        function publicInvaderInterface(){
            return {
                getPosition: getPosition,

                setPosition: setPosition,

                setX: setX,
                setY: setY,

                appendX: appendX,
                appendY: appendY,

                view: _view,
                physicsObject: _physicsModel,

                isToBeDeleted: isToBeDeleted
            };
        }

        return publicInvaderInterface();

    }(options, doneCallback));

    return _invader;
}

