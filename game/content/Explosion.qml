import QtQuick 2.0
import QtQuick.Particles 2.0

Rectangle {
    id: root

    width: 50
    height: 50
    color: "transparent"

    Timer{
        id: timer

        running: true
        repeat: false
        interval: 1000

        onTriggered: {
            particleSystem.stop();
            root.destroy();
        }
    }

    ParticleSystem {
        id: particleSystem
    }

    Emitter {
        id: emitter

        anchors.centerIn: parent

        width: 50
        height: 50
        system: particleSystem
        emitRate: 100
        lifeSpan: 1000
        lifeSpanVariation: 500
        size: 16
        endSize: 256
    }

    ImageParticle {
        source: "qrc:/content/images/metaball-coloured.png"
        system: particleSystem
    }
}
