.import "invaderPhysicsModel.js" as InvaderPhysicsModel
.import "vector2d.js" as Vector2d

function create(options) {

    var invaderController = (function(qmlRoot, doneCallback){

        var _exports = {};

        var _doneCallback = doneCallback;

        var _qmlRoot = qmlRoot;

        var _dataModel = null;
        var _view = null;

//        _exports.moveLeft = function(deltaTime){
//            _dataModel.position.x += deltaTime * 10;
//        }

//        _exports.moveRight = function(){
//            _dataModel.moveRight();
//        }

//        _exports.moveDown = function(){
//            _dataModel.moveDown();
//        }

//        _exports.fire = function(){
//            _dataModel.fire();
//        }

        // Create the view
        //_doneCallback();

        return _exports;

    }(qmlRoot, doneCallback));

    return invaderController;
}

