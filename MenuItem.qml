import QtQuick 2.0

Rectangle {
    width: 100
    height: 70

    color: "lightgray"

    property alias buttonText: text1.text
    property alias contentWidth: text1.contentWidth

    signal itemClicked

    MouseArea{
        anchors.fill: parent
        hoverEnabled: true
        acceptedButtons: Qt.LeftButton

        onClicked: {
            console.log("item " + buttonText + " clicked.")
            itemClicked()
        }

        onEntered: {
            console.log("item " + buttonText + " entered.")
            text1.color = "white"
        }

        onExited: {
            console.log("item " + buttonText + " left.")
            text1.color = "black"
        }
    }

    Text{
        id: text1

        anchors.centerIn: parent

        text: "WHAAAA"

        font { family: "Consolas"; pointSize: 24 }

        horizontalAlignment: Text.AlignHCenter

        color: "black"
    }
}

