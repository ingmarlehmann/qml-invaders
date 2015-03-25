import QtQuick 2.0

Rectangle{
    id: root

    color: "white"

    width: 3
    height: 20

    property string name: "PlayerProjectileRoot"
    property alias physicsBody: physicsBody


//    Behavior on y {
//        NumberAnimation{
//            duration: 30000
//        }
//    }

    PhysicsBodyBox2D{
        id: physicsBody

        property string name: "PlayerProjectilePhysicsBody"

        anchors.centerIn: parent

        x: parent.x
        y: parent.y

        width: parent.width
        height: parent.height

        Component.onCompleted: {
            //console.log("PlayerProjectile:PhysicsBody x: " + x + " y: " + y + " width: " + width + " height: " + height);
        }
    }
}
