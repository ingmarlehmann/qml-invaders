import QtQuick 2.0

Rectangle{
    id: root

    height: text.contentHeight
    width: text.contentWidth

    property alias text: text.text

    color: "transparent"

    Text{
        id: text

        anchors.left: parent.left

        text: "ACTION"
        font.pixelSize: 24
        color: "#00ff00"
    }
}


