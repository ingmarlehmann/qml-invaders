.import "constants.js" as Constants
.import "objectFactory.js" as ObjectFactory
.import "playerLaserProjectilePhysicsModel.js" as PlayerLaserProjectilePhysicsModel

function create(options, doneCallback){
    var playerLaserProjectile = (function(options, doneCallback){

        var _exports = {};

        var _view = null;
        var _physicsModel = null;

        var _deleteMe = false;

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
                console.log("Error: No physics model created for player laser projectile. Can't set position for physics model.");
            }

            if(_view !== null && _view !== undefined){
                _view.x = x;
                _view.y = y;
            }
            else{
                console.log("Error: No view created for player laser projectile. Can't set position for view.");
            }
        }

        _exports.setX = function(x){
            if(_physicsModel !== null && _physicsModel !== undefined){
                _physicsModel.physicsBody.setX(x);
            }
            else {
                console.log("Error: No physics model created for player laser projectile. Can't set position for physics model.");
            }

            if(_view !== null && _view !== undefined){
                _view.x = x;
            }
            else{
                console.log("Error: No view created for player laser projectile. Can't set position for view.");
            }
        }

        _exports.setY = function(y){
            if(_physicsModel !== null && _physicsModel !== undefined){
                _physicsModel.physicsBody.setY(y);
            }
            else {
                console.log("Error: No physics model created for player laser projectile. Can't set position for physics model.");
            }

            if(_view !== null && _view !== undefined){
                _view.y = y;
            }
            else{
                console.log("Error: No view created for player laser projectile. Can't set position for view.");
            }
        }

        // Return a copy of the position object so
        // that the original can not be modified.
        _exports.getPosition = function(){
            if(_physicsModel === null || _physicsModel === undefined){
                console.log("Error: No physics model created for player laser projectile. Can't get position.");
                return null;
            }

            return _physicsModel.physicsBody.getPosition();
        }

        var _onCollision = function(collidingObject){
            //console.log("player laser projectile was hit!");
            _exports.deleteLater();
        }

        var _onViewObjectCreated = function(object){
            if(object === null || object === undefined){
                console.log("Error: Failed to create View object for player laser projectile.");
                doneCallback(null);
                return;
            }

            _view = object;
            _createPhysicsModel();
        }

        var _createPhysicsModel = function(){
            _physicsModel =
                    PlayerLaserProjectilePhysicsModel.create(
                        _view.width,
                        _view.height,
                        _onCollision);

            if(_physicsModel === null || _physicsModel === undefined){
                console.log("Error: Failed to create Physics model for player laser projectile.");
                doneCallback(null);
                return;
            }

            _physicsModel.physicsBody.setPosition(_view.x, _view.y);

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
        var _options = { qmlfile: 'PlayerProjectile.qml',
                        qmlparameters: { x: options.x, y: options.y } };

        ObjectFactory.createObject(_options, _onViewObjectCreated);

        return _exports;

    }(options, doneCallback));

    return playerLaserProjectile;
};
