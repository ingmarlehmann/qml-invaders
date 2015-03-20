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
}
