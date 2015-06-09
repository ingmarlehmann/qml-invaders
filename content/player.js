.import "constants.js" as Constants
.import "pubsub.js" as PS
.import "playerPhysicsModel.js" as PlayerPhysicsModel
.import "objectFactory.js" as ObjectFactory

function create(options, doneCallback){
    var player = (function(options, doneCallback){

        var _exports = {};

        var _initialLives = options.lives;
        var _lives = options.lives;

        var _view = null;
        var _physicsModel = null;

        _exports.moveDir = Constants.MOVEDIR_NONE;
        _exports._deleteMe = false;

        _exports.deleteLater = function(){
            _physicsModel.deleteLater();
            _exports._deleteMe = true;
        }

        _exports.setPosition = function(x, y){
            if(_physicsModel !== null && _physicsModel !== undefined){
                _physicsModel.physicsBody.setPosition(x, y);
            }
            else {
                console.log("Error: No physics model created for player. Can't set position for physics model.");
            }

            if(_view !== null && _view !== undefined){
                _view.x = x;
                _view.y = y;
            }
            else{
                console.log("Error: No view created for player. Can't set position for view.");
            }

            //PS.PubSub.publish(Constants.TOPIC_PLAYER_POSITION, { x: _position._x, y: _position._y });
        }

        _exports.setX = function(x){
            if(_physicsModel !== null && _physicsModel !== undefined){
                _physicsModel.physicsBody.setX(x);
            }
            else {
                console.log("Error: No physics model created for player. Can't set position for physics model.");
            }

            if(_view !== null && _view !== undefined){
                _view.x = x;
            }
            else{
                console.log("Error: No view created for player. Can't set position for view.");
            }

            //PS.PubSub.publish(Constants.TOPIC_PLAYER_POSITION, { x: _position._x, y: _position._y });
        }

        _exports.setY = function(y){
            if(_physicsModel !== null && _physicsModel !== undefined){
                _physicsModel.physicsBody.setY(y);
            }
            else {
                console.log("Error: No physics model created for player. Can't set position for physics model.");
            }

            if(_view !== null && _view !== undefined){
                _view.y = y;
            }
            else{
                console.log("Error: No view created for player. Can't set position for view.");
            }

            //PS.PubSub.publish(Constants.TOPIC_PLAYER_POSITION, { x: _position._x, y: _position._y });
        }

        // Return a copy of the position object so
        // that the original can not be modified.
        _exports.getPosition = function(){
            if(_physicsModel === null || _physicsModel === undefined){
                console.log("Error: No physics model created for player. Can't get position.");
                return null;
            }

            return _physicsModel.physicsBody.getPosition();
        }

        _exports.hit = function(lives){
            setLives(getLives()-lives);
            PS.PubSub.publish(Constants.TOPIC_PLAYER_HIT, lives);
        }

        _exports.isDead = function(){
            return (_lives <= 0);
        }

        _exports.respawn = function(){
            setLives(_initialLives);
            PS.PubSub.publish(Constants.TOPIC_PLAYER_RESPAWNED, 1);
        }

        _exports.getLives = function(){
            return _lives;
        }

        var setLives = function(lives){
            _lives = lives;

            if(_lives <= 0){
                PS.PubSub.publish(Constants.TOPIC_PLAYER_DIED, 1);
            }
        }

        var _onCollision = function(collidingObject){
            console.log("Player was hit by '" + collidingObject + "'");
            _exports.deleteMe = true;
        }

        var _onViewObjectCreated = function(object){
            if(object === null || object === undefined){
                console.log("Error: Failed to create View object for player.");
                doneCallback(null);
                return;
            }

            _view = object;
            _createPhysicsModel();
        }

        var _createPhysicsModel = function(){
            _physicsModel = PlayerPhysicsModel.create(_view.width, _view.height, _onCollision);

            if(_physicsModel === null || _physicsModel === undefined){
                console.log("Error: Failed to create Physics model for player.");
                doneCallback(null);
                return;
            }

            _onFinishedCreation();
        }

        var _onFinishedCreation = function(){
            _exports.view = _view;
            _exports.physicsObject = _physicsModel;

            if(doneCallback !== null && doneCallback !== undefined){
                doneCallback(_exports);
            }
        }

        // Create view
        var _options = { qmlfile: 'PlayerShip.qml',
                        qmlparameters: { x: options.x, y: options.y } };

        ObjectFactory.createObject(_options, _onViewObjectCreated);

        return _exports;

    }(options, doneCallback));

    return player;
};
