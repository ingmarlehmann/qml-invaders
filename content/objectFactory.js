.pragma library

.import "constants.js" as Constants

var rootObject = null;

// Set the root QML object
// all created objects will be children of
// this object.
function setRootQmlObject(qmlRootObject){
    rootObject = qmlRootObject;
}

//
// Description:
//
// Create a new QML object from an existing QML file, and add it to the
// QML scene dynamically.
//
// Example usage:
//------------------------------------------------------
// var qmlObjectParameters = { x: 20, y: 20 };
// var options = { qmlfile: 'EnemyShip.qml', qmlparameters: qmlObjectParameters };
//
// var callback = function(object){
//    console.log("QML object created.");
//    object.source = 'qrc:/content/images/invader1.png';
// }
//
// ObjectFactory.createObject(options, callback);
// ----------------------------------------------------
//
// Parameters:
//
// options.qmlfile: qml file to instantiate
// options.qmlparameters: parameters to set on the new object instance.
//  example: { x: 20, y: 20 }
// callback: callback that will be called when the object has been instantiated
//  and added to the qml scene.
//
function createObject(options, callback){
    if(rootObject === null){
        console.log("Error: You must first set a root object before calling createObject().");
        return;
    }

    var component = Qt.createComponent(options.qmlfile);
    if(component === null){
        console.log("Failed to create QML Component. File doesn't exist?");
        return;
    }

    if (component.status === Constants.COMPONENT_READY){
        _finishCreation(options, component, callback);
    }
    else{
        component.statusChanged.connect(_finishCreation(options, component, callback));
    }
}

function _finishCreation(options, component, callback) {
    if(component.status !== Constants.COMPONENT_READY){
        console.log("Error: QML Component failed.");
        if(callback !== null && callback !== undefined){
            callback(null);
        }
        return;
    }

    var sprite;

    if(options.qmlparameters !== null && options.qmlparameters !== undefined){
        sprite = component.createObject(rootObject, options.qmlparameters);
    }
    else{
        sprite = component.createObject(rootObject);
    }

    if(sprite === null) {
        console.log("Failed to create QML Object");
        if(callback !== null && callback !== undefined){
            callback(null);
        }
        return;
    }

    // postcreateparameters:
    // {a: 'value', b: 'value', c: 'value'}
    if(options.qmlpostparameters !== null && options.qmlpostparameters !== undefined){
        for(var key in options.qmlpostparameters){

            var attrName = key;
            var attrValue = options.qmlpostparameters[key];

            sprite[attrName] = attrValue;
        }
    }

    if(callback !== null && callback !== undefined){
        callback(sprite);
    }
}
