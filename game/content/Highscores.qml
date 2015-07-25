import QtQuick 2.0

Rectangle {
    id: root

    anchors.fill: parent
    anchors.centerIn: parent

    color: "black"

    signal quit()

    Column{
        anchors.centerIn: parent
        spacing: 10

        Text{
            anchors.horizontalCenter: parent.horizontalCenter
            text: "DEM SCORES TO BE SHOWN HERE"
            font.pixelSize: 24
            color: "#00ff00"
        }
    }

    Text{
        id: infoText

        anchors.horizontalCenter: parent.horizontalCenter

        anchors.bottom: parent.bottom
        anchors.bottomMargin: 20

        font.pixelSize: 24
        color: "#00ff00"

        text: "Press ESCAPE to exit"
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

