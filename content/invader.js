.import "vector2d.js" as Vector2d
.import "objectFactory.js" as ObjectFactory
.import "invaderPhysicsModel.js" as InvaderPhysicsModel

function create(options, doneCallback) {

    var _invader = (function(options, doneCallback){

        var _exports = {};

        var _dataModel = null;
        var _view = null;

        var _onCollision = function(collidingObject){
            console.log("Invader was hit!");
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
            _dataModel = InvaderPhysicsModel.create(_view.width, _view.height, _onCollision);

            if(_dataModel === null || _dataModel === undefined){
                console.log("Error: Failed to create Physics model for invader.");
                doneCallback(null);
                return;
            }

            _dataModel.physicsBody.setPosition(_view.x, _view.y);

            _onFinishedCreation();
        }

        var _onFinishedCreation = function(){
            _exports.view = _view;
            _exports.physicsObject = _dataModel;

            doneCallback(_exports);
        }

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

