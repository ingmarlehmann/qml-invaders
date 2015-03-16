import QtQuick 2.0

Rectangle {
    width: parent.width
    height: parent.height

    color: "black"

    signal quit()

    Keys.onEscapePressed: {
        quit()
    }
}

