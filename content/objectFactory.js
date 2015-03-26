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
            else if(object === "enemyProjectile"){
                _component = Qt.createComponent("EnemyProjectile.qml");
            }
            else if(object === "playerShip"){
                _component = Qt.createComponent("PlayerShip.qml");
            }
            else if(object === "enemyShip1" || object === "enemyShip2" || object === "enemyShip3"){
                _component = Qt.createComponent("EnemyShip.qml");
            }

            if (_component.status === Component.Ready)
                finishCreation(object, params, parent, completedCallback);
            else
                _component.statusChanged.connect(finishCreation(object, params, parent, completedCallback));
        };

        // Access level: Private
        // Description: Create a qml object instance.
        var finishCreation = function(name, params, parent, completedCallback) {
            if (_component.status === Component.Ready) {
                _sprite = _component.createObject(parent, params);
                if(_sprite === null) {
                    // Error Handling
                    console.log("Error creating object");
                    completedCallback(null);
                }

                // Name the object for debugging purposes.
                _sprite.objectName = name;

                if(_sprite.objectName === "enemyShip1"){
                    _sprite.source = "qrc:/content/images/invader1.png";
                }

                if(_sprite.objectName === "enemyShip2"){
                    _sprite.source = "qrc:/content/images/invader2.png";
                }

                if(_sprite.objectName === "enemyShip3"){
                    _sprite.source = "qrc:/content/images/invader3.png";
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
