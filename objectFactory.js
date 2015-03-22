var component;
var sprite;

function createObject(object, params, parent, completedCallback) {
    if(object === "playerProjectile"){
        component = Qt.createComponent("PlayerProjectile.qml");
    }
    else if(object === "enemyShip1"){
        component = Qt.createComponent("EnemyShip1.qml");
    }
    else if(object === "enemyShip2"){
        component = Qt.createComponent("EnemyShip2.qml");
    }
    else if(object === "enemyShip3"){
        component = Qt.createComponent("EnemyShip3.qml");
    }

    if (component.status === Component.Ready)
        finishCreation(parent, params, completedCallback);
    else
        component.statusChanged.connect(finishCreation(parent, params, completedCallback));
 }

function finishCreation(parent, params, completedCallback) {
    if (component.status === Component.Ready) {
        sprite = component.createObject(parent, params);
        if (sprite === null) {
            // Error Handling
            console.log("Error creating object");
            completedCallback(null);
        }
        completedCallback(sprite);
    } else if (component.status === Component.Error) {
        // Error Handling
        console.log("Error loading component:", component.errorString());
        completedCallback(null);
    }
}
