import QtQuick 2.0

Image{
    id: root

    width: 50
    height: 50

    source: "qrc:/content/images/invader1.png"

    property string name: "EnemyShip1Root"

    property alias physicsBody: physicsBody

    property double lastCollision: 0

    PhysicsBodyBox2D{
        id: physicsBody

        property string name: "EnemyShip1PhysicsBody"

        anchors.centerIn: parent

        width: parent.width
        height: parent.height

        Component.onCompleted: {
            //console.log("EnemyShip:PhysicsBody x: " + parent.x + " y: " + parent.y + " width: " + parent.width + " height: " + parent.height);
        }
    }
}
