import QtQuick 2.0

Image {
    id: touchButtonRoot

    width: 50
    height: 50

    signal pressed();
    signal released();

    source: "qrc:/content/images/default.gif"

    MultiPointTouchArea{
        id: touchArea

        anchors.fill: parent

        onPressed: {
            touchButtonRoot.pressed();
        }

        onReleased: {
            touchButtonRoot.released();
        }
    }
}

