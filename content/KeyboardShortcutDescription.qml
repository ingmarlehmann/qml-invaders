import QtQuick 2.0

Rectangle{
    id: root

    //anchors.fill: parent
    height: text.contentHeight
    width: text.contentWidth

    property alias text: text.text

    color: "yellow"

    Text{
        id: text

        //horizontalAlignment: Text.AlignRight

        text: "ACTION"
        font.pixelSize: 24
        color: "#00ff00"
    }
}


