.import "constants.js" as Constants
.import "playerPhysicsModel.js" as PlayerPhysicsModel
.import "objectFactory.js" as ObjectFactory

function create(options, doneCallback){
    var player = (function(options, doneCallback){

        var _exports = {};

        // ----------------
        // Private variables
        // ----------------
        var _initialLives = options.lives;
        var _lives = options.lives;

        var _view = null;
        var _physicsModel = null;

        var _deleteMe = false;

        // ----------------
        // Public variables
        // ----------------
        _exports.moveDir = Constants.MOVEDIR_NONE;

        // ----------------
        // Public methods
        // ----------------
        _exports.deleteLater = function(){
            _physicsModel.deleteLater();
            _deleteMe = true;
        }

        _exports.isToBeDeleted = function(){
            return _deleteMe;
        }

        _exports.setPosition = function(x, y){
            if(_physicsModel){
                _physicsModel.physicsBody.setPosition(x, y);
            }
            else {
                console.log("Error: No physics model created for player. Can't set position for physics model.");
            }
            if(_view){
                _view.x = x;
                _view.y = y;
            }
            else{
                console.log("Error: No view created for player. Can't set position for view.");
            }
            _emitNewPosition();
        }

        _exports.setX = function(x){
            if(_physicsModel){
                _physicsModel.physicsBody.setX(x);
            }
            else {
                console.log("Error: No physics model created for player. Can't set position for physics model.");
            }
            if(_view){
                _view.x = x;
            }
            else{
                console.log("Error: No view created for player. Can't set position for view.");
            }
            _emitNewPosition();
        }

        _exports.setY = function(y){
            if(_physicsModel){
                _physicsModel.physicsBody.setY(y);
            }
            else {
                console.log("Error: No physics model created for player. Can't set position for physics model.");
            }
            if(_view){
                _view.y = y;
            }
            else{
                console.log("Error: No view created for player. Can't set position for view.");
            }
            _emitNewPosition();
        }

        // Return a copy of the position object so
        // that the original can not be modified.
        _exports.getPosition = function(){
            if(!_physicsModel){
                console.log("Error: No physics model created for player. Can't get position.");
                return null;
            }
            return _physicsModel.physicsBody.getPosition();
        }

        _exports.hit = function(lives){
            _setLives(_exports.getLives()-lives);
        }

        _exports.isDead = function(){
            return (_lives <= 0);
        }

        _exports.respawn = function(){
            _setLives(_initialLives);
            _view.respawned();
        }

        _exports.getLives = function(){
            return _lives;
        }

        // ----------------
        // Private methods
        // ----------------
        var _setLives = function(lives){
            _lives = lives;
            _view.numLivesChanged(lives);

            if(_lives <= 0){
                _animateExplosion();
                _view.died();
                _exports.deleteLater();
            }
        }

        var _emitNewPosition = function(){
            var pos = _exports.getPosition();
            _view.positionChanged(pos.getX(), pos.getY());
        }

        var _onCollision = function(collidingObject){
            //console.log("DEBUG: Player was hit by '" + collidingObject + "'");
            _exports.hit(1);
        }

        var _animateExplosion = function(){
            function onExplosionAnimationCreated(object){
                if(object){
                    console.log("failed to spawn explosion!");
                }
            }

            var pos = _physicsModel.physicsBody.getPosition();
            var options = { qmlfile: 'Explosion.qml',
                            qmlparameters: { x: pos.x, y: pos.y } };

            ObjectFactory.createObject(options, onExplosionAnimationCreated);
        }

        var _onViewObjectCreated = function(object){
            if(!object){
                console.log("Error: Failed to create View object for player.");
                doneCallback(null);
                return;
            }
            _view = object;
            _createPhysicsModel();
        }

        var _createPhysicsModel = function(){
            _physicsModel = PlayerPhysicsModel.create(_view.width, _view.height, _onCollision);

            if(!_physicsModel){
                console.log("Error: Failed to create Physics model for player.");
                doneCallback(null);
                return;
            }
            _onFinishedCreation();
        }

        var _onFinishedCreation = function(){
            _exports.view = _view;
            _exports.physicsObject = _physicsModel;

            if(doneCallback){
                doneCallback(_exports);
            }
        }

        // ----------------
        // Constructor
        // ----------------

        // Create view
        var _options = { qmlfile: 'PlayerShip.qml',
                        qmlparameters: { x: options.x } };
        ObjectFactory.createObject(_options, _onViewObjectCreated);

        return _exports;

    }(options, doneCallback));

    return player;
};
