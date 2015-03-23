import QtQuick 2.0

Image{
    id: root
    anchors.bottom: parent.bottom

    cache: true
    asynchronous: true
    smooth: true

    width: 50
    height: 50

    source: "qrc:/data/images/ship.jpeg"
}

