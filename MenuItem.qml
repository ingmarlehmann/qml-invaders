import QtQuick 2.0

Rectangle {
    width: 20
    height: 70

    color: "lightgray"

    property alias buttonText: text1.text
    property alias contentWidth: text1.contentWidth

    signal itemClicked
    signal itemSelected

    MouseArea{
        anchors.fill: parent
        hoverEnabled: true
        acceptedButtons: Qt.LeftButton

        onClicked:  { itemClicked() }
        onEntered:  { select() }
    }

    function select() {
        text1.color = "white"
        itemSelected()
    }

    function deselect() {
        text1.color = "black"
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
