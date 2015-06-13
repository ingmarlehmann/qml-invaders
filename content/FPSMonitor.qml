import QtQuick 2.0
// pretty much entirely stolen from:
// https://github.com/capisce/motionblur/blob/master/main.qml
Text {
    property real t
    property int frame: 0
    property bool enabled: false
    visible: enabled
    function toggle() {
        enabled = !enabled
    }
    onEnabledChanged: {
        if (!enabled) {
            fpsTimer.stop()
            tAnim.stop()
        } else {
            fpsTimer.start()
            tAnim.start()
        }
    }
    Timer {
        id: fpsTimer
        property real fps: 0
        repeat: true
        interval: 1000
        onTriggered: {
            fps = frame
            frame = 0
        }
    }
    NumberAnimation on t {
        id: tAnim
        from: 0
        to: 100
        loops: Animation.Infinite
        Component.onCompleted: stop()
    }
    onTChanged: {
        update() // force continuous animation
        ++frame
    }
    text: "FPS: " + fpsTimer.fps
}
