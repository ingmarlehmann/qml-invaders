.import "constants.js" as Constants
.import "invaderLaserProjectilePhysicsModel.js" as InvaderLaserProjectilePhysicsModel
.import "objectFactory.js" as ObjectFactory

function create(options, doneCallback){
    var invaderLaserProjectile = (function(options, doneCallback){

        var _exports = {};

        // ----------------
        // Private variables
        // ----------------

        var _view = null;
        var _physicsModel = null;
        var _deleteMe = false;

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
                console.log("Error: No physics model created for invader laser projectile. Can't set position for physics model.");
            }

            if(_view){
                _view.x = x;
                _view.y = y;
            }
            else{
                console.log("Error: No view created for invader laser projectile. Can't set position for view.");
            }
        }

        _exports.setX = function(x){
            if(_physicsModel){
                _physicsModel.physicsBody.setX(x);
            }
            else {
                console.log("Error: No physics model created for invader laser projectile. Can't set position for physics model.");
            }

            if(_view){
                _view.x = x;
            }
            else{
                console.log("Error: No view created for invader laser projectile. Can't set position for view.");
            }
        }

        _exports.setY = function(y){
            if(_physicsModel){
                _physicsModel.physicsBody.setY(y);
            }
            else {
                console.log("Error: No physics model created for invader laser projectile. Can't set position for physics model.");
            }

            if(_view){
                _view.y = y;
            }
            else{
                console.log("Error: No view created for invader laser projectile. Can't set position for view.");
            }
        }

        // Return a copy of the position object so
        // that the original can not be modified.
        _exports.getPosition = function(){
            if(!_physicsModel){
                console.log("Error: No physics model created for invader laser projectile. Can't get position.");
                return null;
            }

            return _physicsModel.physicsBody.getPosition();
        }

        // ----------------
        // Private methods
        // ----------------
        var _onCollision = function(collidingObject){
            _exports.deleteLater();
        }

        var _onViewObjectCreated = function(object){
            if(!object){
                console.log("Error: Failed to create View object for invader laser projectile.");
                doneCallback(null);
                return;
            }

            _view = object;
            _createPhysicsModel();
        }

        var _createPhysicsModel = function(){
            _physicsModel =
                    InvaderLaserProjectilePhysicsModel.create(
                        _view.width,
                        _view.height,
                        _onCollision);

            if(!_physicsModel){
                console.log("Error: Failed to create Physics model for invader laser projectile.");
                doneCallback(null);
                return;
            }

            _physicsModel.physicsBody.setPosition(_view.x, _view.y);
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
        var _options = { qmlfile: 'EnemyProjectile.qml',
                        qmlparameters: { x: options.x, y: options.y } };

        ObjectFactory.createObject(_options, _onViewObjectCreated);

        return _exports;

    }(options, doneCallback));

    return invaderLaserProjectile;
};
