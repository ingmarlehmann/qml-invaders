.pragma library

var TIMER_FACTORY = {};
TIMER_FACTORY.rootObject = null;

// Set the root QML object
// all created objects will be children of
// this object.
function setRootQmlObject(qmlRootObject){
    TIMER_FACTORY.rootObject = qmlRootObject;
}

function createTimer(){
    var closure = (function() {
        if(TIMER_FACTORY.rootObject === null){
            console.log("Error: You must first set a root object before calling createTimer().");
            return;
        }

        var timer = Qt.createQmlObject("import QtQuick 2.0; Timer {}", TIMER_FACTORY.rootObject);
        return timer;
    }());
    return closure;
}
