import QtQuick 2.0
import QtQuick.Layouts 1.1

Rectangle {
    id: helpRoot

    anchors.fill: parent
    anchors.centerIn: parent

    color: "black"

    signal quit()

    GridView{
        id: grid

        width: parent.width*0.7
        height: parent.height*0.7

        anchors.centerIn: parent

        cellWidth: width/2
        cellHeight: 28

        model: ListModel{
            ListElement { name: "ACTION" }
            ListElement { name: "KEY" }

            ListElement { name: "Move right" }
            ListElement { name: "Right" }

            ListElement { name: "Move left" }
            ListElement { name: "Left" }

            ListElement { name: "Shoot" }
            ListElement { name: "Space" }

            ListElement { name: "Back" }
            ListElement { name: "Escape" }

            ListElement { name: "Toggle FPS counter" }
            ListElement { name: "F" }

            ListElement { name: "Toggle physics debug" }
            ListElement { name: "P" }
        }

        delegate: Rectangle{
            width: grid.cellWidth
            height: grid.cellHeight
            border.color: "#00ff00"
            border.width: 1
            color: (index === 0 || index === 1) ? "green" : "black"

            Text{
                anchors.fill: parent
                text: name
                color: "#00ff00"
                horizontalAlignment: Text.AlignHCenter
            }
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

