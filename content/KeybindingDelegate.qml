import QtQuick 2.0

Rectangle{
    id: root

    width: parent.width
    height: (index === 0) ? 35 : 45
    clip: true

    Rectangle{
        anchors.left: parent.left
        anchors.top: parent.top
        anchors.bottom: parent.bottom

        width: parent.width/2
        height: descriptionText.contentHeight
        border.color: "#00ff00"
        border.width: 1
        color: (index === 0) ? "green" : "black"

        Text{
            id: descriptionText
            //anchors.margins: 10
            anchors.fill: parent
            text: description
            font.pixelSize: 24
            color: "#00ff00"
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
        }
    }

    Rectangle{
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.bottom: parent.bottom

        width: parent.width/2
        height: keyText.contentHeight
        border.color: "#00ff00"
        border.width: 1
        color: (index === 0) ? "green" : "black"

        Text{
            id: keyText
            //anchors.margins: 10
            anchors.fill: parent
            text: key
            font.pixelSize: 24
            color: "#00ff00"
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
        }
    }
}
