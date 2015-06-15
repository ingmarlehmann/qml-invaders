import QtQuick 2.0

Rectangle{
    id: root

    width: parent.width
    height: Math.max(descriptionText.contentHeight, keyText.contentHeight)

    Rectangle{
        anchors.left: parent.left
        width: parent.width/2
        height: descriptionText.contentHeight
        border.color: "#00ff00"
        border.width: 1
        color: (index === 0) ? "green" : "black"

        Text{
            id: descriptionText
            anchors.fill: parent
            text: description
            font.pixelSize: 20
            color: "#00ff00"
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
        }
    }

    Rectangle{
        anchors.right: parent.right
        width: parent.width/2
        height: keyText.contentHeight
        border.color: "#00ff00"
        border.width: 1
        color: (index === 0) ? "green" : "black"

        Text{
            id: keyText
            anchors.fill: parent
            text: key
            font.pixelSize: 20
            color: "#00ff00"
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
        }
    }
}
