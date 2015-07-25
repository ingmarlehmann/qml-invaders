import QtQuick 2.0

Rectangle{
    id: root
    color: "black"

    Text{
        id: gameOverText

        opacity: 1.0

        text: "Game Over"
        color: "red"

        font.pixelSize: 48

        anchors.verticalCenter: parent.verticalCenter
        anchors.verticalCenterOffset: -100
        anchors.horizontalCenter: parent.horizontalCenter
    }

    Text{
        id: infoText

        anchors.horizontalCenter: parent.horizontalCenter

        anchors.bottom: parent.bottom
        anchors.bottomMargin: 20

        font.pixelSize: 24
        color: "red"

        text: "Press any key to exit"
    }
}
