.import "invaderPhysicsModel.js" as InvaderPhysicsModel
.import "vector2d.js" as Vector2d
.import "objectFactory.js" as ObjectFactory

function create(options, doneCallback) {

    var _invader = (function(options, doneCallback){

        var _exports = {};

        var _dataModel = null;
        var _view = null;

        var _onCollision = function(collidingObject){
            console.log("I was hit!");
        }

        var _onViewObjectCreated = function(object){
            if(object === null || object === undefined){
                console.log("Failed to create View object for invader.");
                doneCallback("fail");
                return;
            }

            _view = object;
            _dataModel = InvaderPhysicsModel.create(_view.width, _view.height, _onCollision);

            doneCallback("success");
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
                        qmlparameters: { x: 0, y: 0 },
                        qmlpostparameters: { source: texture } };

        ObjectFactory.createObject(_options, _onViewObjectCreated);

        return _exports;

    }(options, doneCallback));

    return _invader;
}

