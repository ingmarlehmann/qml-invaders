function createObjectFactory(){
    var objectFactory = (function(){
        var _exports = {};

        var _component;
        var _sprite;

        // Access level: Public
        // Description: Create a QML component.
        // @param object Type of object to create.
        // @param params Parameters to set at construction time for object.
        // @param parent Parent object.
        // @param completedCallback callback that will be called with instance reference when creation is complete.
        _exports.createObject = function(object, params, parent, completedCallback) {
            if(object === "playerProjectile"){
                _component = Qt.createComponent("PlayerProjectile.qml");
            }
            else if(object === "enemyShip1"){
                _component = Qt.createComponent("EnemyShip1.qml");
            }
            else if(object === "enemyShip2"){
                _component = Qt.createComponent("EnemyShip2.qml");
            }
            else if(object === "enemyShip3"){
                _component = Qt.createComponent("EnemyShip3.qml");
            }

            if (_component.status === Component.Ready)
                finishCreation(parent, params, completedCallback);
            else
                _component.statusChanged.connect(finishCreation(parent, params, completedCallback));
        };

        // Access level: Private
        // Description: Create a qml object instance.
        var finishCreation = function(parent, params, completedCallback) {
            if (_component.status === Component.Ready) {
                _sprite = _component.createObject(parent, params);
                if(_sprite === null) {
                    // Error Handling
                    console.log("Error creating object");
                    completedCallback(null);
                }
                completedCallback(_sprite);
            } else if (_component.status === Component.Error) {
                // Error Handling
                console.log("Error loading _component:", _component.errorString());
                completedCallback(null);
            }
        }

        return _exports;

    }());

    return objectFactory;
}
