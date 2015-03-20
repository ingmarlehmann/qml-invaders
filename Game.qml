import QtQuick 2.0

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
                console.log("moving ship left. dT: " + dT + " step: " + root.step + " move len: " + (root.step*dT) + " abs pos: " + root.shipX);
            } else if(moveDir === constants.movedir_right){
                root.shipX = Math.min(parent.width-playerShip.width, root.shipX + (root.step * dT));
                console.log("moving ship right. dT: " + dT + " step: " + root.step + " move len: " + (root.step*dT) + " abs pos: " + root.shipX);
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


    Image{
        id: playerShip
        anchors.bottom: parent.bottom

        cache: true
        asynchronous: true
        smooth: true

        x: root.shipX

        width: 50
        height: 50

        source: "qrc:/images/ship.jpeg"
    }

    Keys.onEscapePressed: {
        quit()
    }

    Keys.onPressed: {
        if(event.key === Qt.Key_Left){
            if(!event.isAutoRepeat){
                moveDir |= constants.movedir_left;
                //console.log("Keys.onPressed(event.key='Qt.Key_Left&&event.isAutoRepeat=false)");
            } else {
                //console.log("Keys.onPressed(event.key='Qt.Key_Left&&event.isAutoRepeat=true)");
            }

            event.accepted = true;
        }
        if(event.key === Qt.Key_Right){
            if(!event.isAutoRepeat){
                moveDir |= constants.movedir_right;
                //console.log("Keys.onPressed(event.key='Qt.Key_Right&&event.isAutoRepeat=false)");
            } else {
                //console.log("Keys.onPressed(event.key='Qt.Key_Left&&event.isAutoRepeat=true)");
            }

            event.accepted = true;
        }
        //if(event.key === Qt.Key_Q){
        //    event.accepted = true;
            //quit()
        //}
    }

    Keys.onReleased: {
        if(event.key === Qt.Key_Left){
            if(!event.isAutoRepeat){
                //console.log("Keys.onReleased(event.key='Qt.Key_Left&&event.isAutoRepeat=false)");
                moveDir &= ~(constants.movedir_left);
            } else {
                //console.log("Keys.onReleased(event.key='Qt.Key_Left&&event.isAutoRepeat=true)");
            }

            event.accepted = true;
        }

        if(event.key === Qt.Key_Right){
            if(!event.isAutoRepeat){
                //console.log("Keys.onReleased(event.key='Qt.Key_Right&&event.isAutoRepeat=false)");
                moveDir &= ~(constants.movedir_right);
            } else {
                //console.log("Keys.onReleased(event.key='Qt.Key_Right&&event.isAutoRepeat=true)");
            }

            event.accepted = true;
        }

        if(event.key === Qt.Key_Q){
            event.accepted = true;
            quit()
        }
    }

    Item{
        id: constants

        readonly property int movedir_none:     (0<<0)
        readonly property int movedir_left:     (1<<0)
        readonly property int movedir_right:    (1<<1)
    }
}

