import QtQuick 2.0

Rectangle{
    id: enemyProjectileRoot

    color: "red"

    width: 3
    height: 20

    property alias physicsBody: physicsBody

    PhysicsBodyBox2D{
        id: physicsBody
    }
}
