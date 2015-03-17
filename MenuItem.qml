import QtQuick 2.0

Rectangle {
    width: 20
    height: 70

    color: "lightgray"

    property alias buttonText: text1.text
    property alias contentWidth: text1.contentWidth

    signal itemClicked

    property bool highlighted: false
    property bool hovered: false

    MouseArea{
        anchors.fill: parent
        hoverEnabled: true
        acceptedButtons: Qt.LeftButton

        onClicked:  { itemClicked() }
        onEntered:  { hovered = true }
        onExited:   { hovered = false }
    }

    Text{
        id: text1
        color: highlighted ? "white" : "black"
        anchors.centerIn: parent

        text: "Default text"
        font { family: "Consolas"; pointSize: 24 }
        horizontalAlignment: Text.AlignHCenter
    }
}
