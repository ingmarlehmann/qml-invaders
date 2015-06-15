import QtQuick 2.0
import QtQuick.Layouts 1.1

Rectangle {
    id: helpRoot

    anchors.fill: parent
    anchors.centerIn: parent

    color: "black"

    signal quit()

    Column{
        id: grid
        anchors.centerIn: parent

        width: parent.width*0.7

        Repeater{
            model: ListModel{
                ListElement { description: "ACTION"; key: "KEY" }
                ListElement { description: "Move right"; key: "Right" }
                ListElement { description: "Move left"; key: "Left" }
                ListElement { description: "Shoot"; key: "Space" }
                ListElement { description: "Back"; key: "Escape" }
                ListElement { description: "Toggle FPS counter"; key: "F" }
                ListElement { description: "Toggle physics debug"; key: "P" }
            }

            delegate: KeybindingDelegate{ width: parent.width }
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

