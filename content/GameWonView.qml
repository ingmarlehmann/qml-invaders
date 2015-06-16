import QtQuick 2.0

Rectangle{
    id: root
    color: "black"

    Text{
        id: text

        text: "Good job! <br>Alien asses have been kicked"
        horizontalAlignment: Text.AlignHCenter
        color: "#00ff00"

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
        color: "#00ff00"

        text: "Press any key to exit"
    }
}
