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
        anchors.fill: parent
        anchors.centerIn: parent

        cellWidth: width/2
        cellHeight: 28

        model: ListModel{
            ListElement { name: "one" }
            ListElement { name: "two" }
            ListElement { name: "three" }
            ListElement { name: "four" }
            ListElement { name: "five" }
            ListElement { name: "six" }
        }

        delegate: Rectangle{
            width: grid.cellWidth
            height: grid.cellHeight
            border.color: "#00ff00"
            border.width: 2
            color: "black"

            Text{
                anchors.fill: parent
                text: name
                color: "#00ff00"
                horizontalAlignment: Text.AlignHCenter
            }
        }
    }

//    GridLayout {
//        anchors.centerIn: parent
//        anchors.fill: parent

//        columns: 2

//        KeyboardShortcutDescription { text: "ACTION" }
//        KeyboardShortcutKey         { text: "KEY" }

//        KeyboardShortcutDescription { text: "Move right" }
//        KeyboardShortcutKey         { text: "Right" }

//        KeyboardShortcutDescription { text: "Move left" }
//        KeyboardShortcutKey         { text: "Left" }

//        KeyboardShortcutDescription { text: "Shoot" }
//        KeyboardShortcutKey         { text: "Space" }

//        KeyboardShortcutDescription { text: "Exit menu" }
//        KeyboardShortcutKey         { text: "Escape" }

//        KeyboardShortcutDescription { text: "Toggle FPS counter" }
//        KeyboardShortcutKey         { text: "F" }

//        KeyboardShortcutDescription { text: "Toggle physics debug" }
//        KeyboardShortcutKey         { text: "P" }
//    }

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

