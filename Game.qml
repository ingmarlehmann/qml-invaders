import QtQuick 2.0

Rectangle {
    id: root
    width: parent.width
    height: parent.height

    color: "black"

    signal quit()

    property int shipX: (parent.width/2)-(playerShip.width/2)
    property int moveDir: constants.movedir_none

    Keys.onEscapePressed: {
        quit()
    }

    Keys.onPressed: {
        if(event.key === Qt.Key_Left && !event.isAutoRepeat){
            moveDir |= constants.movedir_left;
            console.log("movedir: " + moveDir);
        }
        if(event.key === Qt.Key_Right && !event.isAutoRepeat){
            moveDir |= constants.movedir_right;
            console.log("movedir: " + moveDir);
        }
    }

    Keys.onReleased: {
        if(event.key === Qt.Key_Left && !event.isAutoRepeat){
            moveDir &= ~(constants.movedir_left);
            console.log("movedir: " + moveDir);
        }
        if(event.key === Qt.Key_Right && !event.isAutoRepeat){
            moveDir &= ~(constants.movedir_right);
            console.log("movedir: " + moveDir);
        }
    }

    Timer{
        id: moveTimer
        interval: 16 // 16ms is maximum resolution at 60 fps.
        running: true
        repeat: true
        onTriggered: {
            if(moveDir === constants.movedir_left){
                if(root.shipX > 0){
                    root.shipX -= 10;
                    console.log("moving ship left.");
                }
            } else if(moveDir === constants.movedir_right){
                if(root.shipX <= (parent.width-playerShip.width)){
                    root.shipX += 10;
                    console.log("moving ship right.");
                }
            }
        }
    }

    Grid{
        id: enemies
        anchors.horizontalCenter: parent.horizontalCenter

        columns: 10

        x: 20
        y: 20

        Repeater{
            model: 50

            Image{
                width: 50
                height: 50
                source: "qrc:/images/invader1.png"
            }
        }
    }

    Image{
        id: playerShip
        anchors.bottom: parent.bottom

        x: root.shipX

        width: 50
        height: 50

        source: "qrc:/images/ship.jpeg"
    }

    Item{
        id: constants

        readonly property int movedir_none:     (0<<0)
        readonly property int movedir_left:     (1<<0)
        readonly property int movedir_right:    (1<<1)
    }
}

