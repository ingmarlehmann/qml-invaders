import QtQuick 2.0

Image{
    id: playerShipRoot

    signal positionChanged(real x, real y)
    signal died()
    signal numLivesChanged(int numLivesRemain)
    signal respawned()

    width: 50
    height: 25

    source: "qrc:/content/images/ship.png"
}

