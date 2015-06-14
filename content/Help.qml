import QtQuick 2.0

Rectangle {
    id: helpRoot

    anchors.fill: parent
    anchors.centerIn: parent

    color: "black"

    signal quit()

    Column{
        anchors.centerIn: parent
        spacing: 10

        Text{
            anchors.horizontalCenter: parent.horizontalCenter
            text: "right/left arrows - move player ship"
            font.pixelSize: 24
            color: "#00ff00"
        }
        Text{
            anchors.horizontalCenter: parent.horizontalCenter
            text: "space - shoot"
            font.pixelSize: 24
            color: "#00ff00"
        }
        Text{
            anchors.horizontalCenter: parent.horizontalCenter
            text: "f - toggle FPS counter"
            font.pixelSize: 24
            color: "#00ff00"
        }
        Text{
            anchors.horizontalCenter: parent.horizontalCenter
            text: "p - toggle physics debug"
            font.pixelSize: 24
            color: "#00ff00"
        }
    }

    Keys.onEscapePressed: {
        quit();
    }

    Keys.onReleased: {
        if(event.key === Qt.Key_Q && !event.isAutoRepeat){
            event.accepted = true;
            quit();
        }
    }
}

