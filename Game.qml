import QtQuick 2.0

Rectangle {
    width: parent.width
    height: parent.height

    color: "black"

    signal quit()

    Keys.onEscapePressed: {
        quit()
    }

    Grid{
        id: enemies
        anchors.horizontalCenter: parent.horizontalCenter

        columns: 10

        x: 20
        y: 20

        Repeater{
            model: 50

            Image{
                width: 50
                height: 50
                source: "qrc:/images/invader1.png"
            }
        }
    }

    Image{
        id: playerShip

        anchors.horizontalCenter: parent.horizontalCenter
        anchors.bottom: parent.bottom

        width: 50
        height: 50

        source: "qrc:/images/ship.jpeg"
    }
}

