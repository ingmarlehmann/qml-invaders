import QtQuick 2.0

Rectangle{
    id: shipRoot
    anchors.bottom: parent.bottom

    color: "#000000"

    width: 50
    height: 25

    Image{
        id: shipImage
        anchors.fill: parent

        visible: true

        anchors.margins: 1

        cache: true
        asynchronous: true
        smooth: true

        source: "qrc:/content/images/ship.png"
    }


}

