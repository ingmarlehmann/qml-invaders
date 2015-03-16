import QtQuick 2.0

Rectangle {
    width: parent.width
    height: parent.height

    color: "black"

    signal quit()

    Keys.onEscapePressed: {
        quit()
    }

    Row{
        Image{
            width: 50
            height: 50
            source: "qrc:/images/invader1.png"
        }
        Image{
            width: 50
            height: 50
            source: "qrc:/images/invader2.png"
        }
        Image{
            width: 50
            height: 50
            source: "qrc:/images/invader3.png"
        }
    }

    Image{
        x: 200
        y: 200

        width: 50
        height: 50
        source: "qrc:/images/ship.jpeg"
    }
}

