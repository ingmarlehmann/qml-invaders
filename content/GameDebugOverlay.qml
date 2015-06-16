import QtQuick 2.0

Rectangle{
    id: root
    color: "transparent"

    function toggleFPSMonitor() { fpsMonitor.toggle(); }

    FPSMonitor{
        id: fpsMonitor

        color: "#00ff00"
        font.pixelSize: 24

        x: parent.width - (fpsMonitor.contentWidth) - 10
        y: 10
    }
}
