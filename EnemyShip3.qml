import QtQuick 2.0

Image{
    id: root

    width: 50
    height: 50
    source: "qrc:/images/invader3.png"

    property alias physicsBody: physicsBody

    PhysicsBodyBox2D{
        id: physicsBody

        x: parent.x
        y: parent.y

        width: parent.width
        height: parent.height

        Component.onCompleted: {
            //console.log("EnemyShip:PhysicsBody x: " + x + " y: " + y + " width: " + width + " height: " + height);
        }
    }
}
