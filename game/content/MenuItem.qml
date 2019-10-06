import QtQuick 2.5

Rectangle {
    width: 20
    height: 70

    color: "black"

    property alias buttonText: text1.text
    property alias contentWidth: text1.contentWidth

    property string textHighlightColor: "#00FF00"
    property string textNormalColor: "#009900"

    signal itemClicked

    property bool highlighted: false
    property bool hovered: false

    MultiPointTouchArea{
        id: touchArea

        anchors.fill: parent
        mouseEnabled: false

        focus: true

        onPressed: {
            itemClicked();
            hovered = true;
        }
    }

    MouseArea{
        anchors.fill: parent
        hoverEnabled: true
        acceptedButtons: Qt.LeftButton

        onClicked:  { itemClicked(); }
        onEntered:  { hovered = true; }
        onExited:   { hovered = false; }
    }

    Text{
        id: text1
        color: highlighted ? textHighlightColor : textNormalColor
        anchors.centerIn: parent

        text: "Default text"
        font { family: "Consolas"; pointSize: 24 }
        horizontalAlignment: Text.AlignHCenter
    }
}
