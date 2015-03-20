import QtQuick 2.0

Rectangle{
    id: root

    color: "white"

    width: 3
    height: 20

    Behavior on y {
        NumberAnimation{
            duration: 3000
        }
    }
}
