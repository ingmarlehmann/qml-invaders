import QtQuick 2.0
import "objectFactory.js" as ObjectFactory

Rectangle {
    id: root
    width: parent.width
    height: parent.height

    color: "black"

    signal quit()

    property int shipX: (parent.width/2)-(playerShip.width/2)
    property int moveDir: constants.movedir_none

    property double lastUpdateTime: 0
    property real step: 0.8

    property var projectiles: []

    Timer{
        id: moveTimer
        interval: 16 // 16ms is maximum resolution at 60 fps.
        running: true
        repeat: true
        onTriggered: {
            var currentTime = new Date().getTime();
            var dT = (currentTime - lastUpdateTime);

            if(moveDir === constants.movedir_left){
                root.shipX = Math.max(0, root.shipX - (root.step * dT));
                //console.log("moving ship left. dT: " + dT + " step: " + root.step + " move len: " + (root.step*dT) + " abs pos: " + root.shipX);
            } else if(moveDir === constants.movedir_right){
                root.shipX = Math.min(parent.width-playerShip.width, root.shipX + (root.step * dT));
                //console.log("moving ship right. dT: " + dT + " step: " + root.step + " move len: " + (root.step*dT) + " abs pos: " + root.shipX);
            }

            lastUpdateTime = new Date().getTime();
        }
    }

    Grid{
        id: enemies
        anchors.horizontalCenter: parent.horizontalCenter

        columns: 10

        x: 20
        y: 20

        Repeater{
            model: 10

            Image{
                width: 50
                height: 50
                source: "qrc:/images/invader1.png"
            }
        }
        Repeater{
            model: 20

            Image{
                width: 50
                height: 50
                source: "qrc:/images/invader2.png"
            }
        }
        Repeater{
            model: 10

            Image{
                width: 50
                height: 50
                source: "qrc:/images/invader3.png"
            }
        }
    }


    Ship{
        id: playerShip
        x: root.shipX
    }

    Keys.onEscapePressed: {
        quit()
    }

    Keys.onPressed: {
        if(event.key === Qt.Key_Left){
            if(!event.isAutoRepeat){
                moveDir |= constants.movedir_left;
            }

            event.accepted = true;
        }
        if(event.key === Qt.Key_Right){
            if(!event.isAutoRepeat){
                moveDir |= constants.movedir_right;
            }

            event.accepted = true;
        }
    }

    Keys.onReleased: {
        if(event.key === Qt.Key_Left){
            if(!event.isAutoRepeat){
                moveDir &= ~(constants.movedir_left);
            }
        }

        if(event.key === Qt.Key_Right){
            if(!event.isAutoRepeat){
                moveDir &= ~(constants.movedir_right);
            }
        }

        if(event.key === Qt.Key_Q){
            event.accepted = true;
            quit()
        }

        if(event.key === Qt.Key_Space){
            if(!event.isAutoRepeat){
                var objectName = "playerProjectile";
                var projectileStartX = playerShip.x + (playerShip.width/2);
                var projectileStartY = root.height - (playerShip.height+30);
                var completedCallback = function(newObject) {
                    if(newObject) {
                        projectiles.push(newObject);
                        newObject.y = 0;
                    } else {
                        console.log("error creating object" + objectName);
                    }
                }

                ObjectFactory.createObject(
                            objectName,
                            { x: projectileStartX, y: projectileStartY },
                            root, // object parent
                            completedCallback );
            }
        }
    }

    Item{
        id: constants

        readonly property int movedir_none:     (0<<0)
        readonly property int movedir_left:     (1<<0)
        readonly property int movedir_right:    (1<<1)
    }
}

