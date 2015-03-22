import QtQuick 2.0

Rectangle{
    id: root
    anchors.bottom: parent.bottom

    color: "red"

    width: 5
    height: 30

    Behavior on y {
        NumberAnimation{
            duration: 2000
        }
    }

    PhysicsBodyBox2D{
        id: physicsBody

        x: root.x
        y: root.y
        width: root.width
        height: root.height
    }
}
