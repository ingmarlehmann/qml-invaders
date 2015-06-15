.import "vector2d.js" as Vector2d
.import "objectFactory.js" as ObjectFactory
.import "invaderPhysicsModel.js" as InvaderPhysicsModel

function create(options, doneCallback) {

    var _invader = (function(options, doneCallback){

        // Exports object that will
        // be returned when invoking create
        var _exports = {};

        // Private member variables
        var _physicsModel = null;
        var _view = null;
        var _deleteMe = false;
        var _eventListeners = {};

        // Public methods
        _exports.deleteLater = function(){
            _physicsModel.deleteLater();
            _deleteMe = true;
        }

        _exports.isToBeDeleted = function(){
            return _deleteMe;
        }

        _exports.setPosition = function(x, y){
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

        _exports.setX = function(x){
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

        _exports.setY = function(y){
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

        _exports.appendX = function(x){
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

        _exports.appendY = function(y){
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
        _exports.getPosition = function(){
            if(_physicsModel === null || _physicsModel === undefined){
                console.log("Error: No physics model created for invader. Can't get position.");
                return null;
            }

            return _physicsModel.physicsBody.getPosition();
        }

        _exports.on = function(event, callback){
            if(_eventListeners[event] === undefined){
                _eventListeners[event] = [];
            }
            _eventListeners[event].push(callback);
        }

        // Private methods
        var _emitEvent = function(event, data){
            if(_eventListeners[event] === undefined){
                return;
            }

            var i;
            for(i=0; i< _eventListeners[event].length; ++i){
               //console.log("invader emitting event:  '" + event + "' number of listeners: " + _eventListeners[event].length);
                _eventListeners[event][i](data);
            }
        }

        var _onCollision = function(collidingObject){
            //console.log("DEBUG: Invader was hit by '" + collidingObject + "'");
            _emitEvent("death", null);
            _animateExplosion();
            _exports.deleteLater();
        }

        var _animateExplosion = function(){
            function onExplosionAnimationCreated(object){
                if(object === undefined || object === null){
                    console.log("failed to spawn explosion!");
                }
            }

            var pos = _physicsModel.physicsBody.getPosition();

            var options = { qmlfile: 'Explosion.qml',
                            qmlparameters: { x: pos.x, y: pos.y } };

            ObjectFactory.createObject(options, onExplosionAnimationCreated);
        }

        var _onViewObjectCreated = function(object){
            if(object === null || object === undefined){
                console.log("Error: Failed to create View object for invader.");
                doneCallback(null);
                return;
            }

            _view = object;
            _createPhysicsModel();
        }

        var _createPhysicsModel = function(){
            _physicsModel = InvaderPhysicsModel.create(_view.width, _view.height, _onCollision);

            if(_physicsModel === null || _physicsModel === undefined){
                console.log("Error: Failed to create Physics model for invader.");
                doneCallback(null);
                return;
            }

            _physicsModel.physicsBody.setPosition(_view.x, _view.y);

            _onFinishedCreation();
        }

        var _onFinishedCreation = function(){
            _exports.view = _view;
            _exports.physicsObject = _physicsModel;

            doneCallback(_exports);
        }

        // Constructor
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

        var _options = { qmlfile: 'EnemyShip.qml',
                        qmlparameters: { x: options.x, y: options.y },
                        qmlpostparameters: { source: texture } };

        ObjectFactory.createObject(_options, _onViewObjectCreated);

        return _exports;

    }(options, doneCallback));

    return _invader;
}

