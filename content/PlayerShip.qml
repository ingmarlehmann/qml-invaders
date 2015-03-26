import QtQuick 2.0

Image{
    id: playerShipRoot
    anchors.bottom: parent.bottom

    width: 50
    height: 25

    source: "qrc:/content/images/ship.png"

    cache: true
    asynchronous: true
    smooth: true

    property alias physicsBody: physicsBody;

    PhysicsBodyBox2D{
        id: physicsBody
    }
}

