import QtQuick 2.0

Rectangle{
    id: enemyProjectileRoot

    color: "red"

    width: 5
    height: 30

    Behavior on y {
        NumberAnimation{
            duration: 2000
        }
    }

    property alias physicsBody: physicsBody

    PhysicsBodyBox2D{
        id: physicsBody
    }
}
