import QtQuick 2.0

Image{
    id: root

    signal positionChanged(real x, real y)
    signal died()
    signal respawned()

    width: 50
    height: 50

    source: "qrc:/content/images/default.gif"
}
