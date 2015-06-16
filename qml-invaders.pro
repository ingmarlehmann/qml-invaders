TEMPLATE = app

QT += qml quick widgets

SOURCES += src/main.cpp

OTHER_FILES += content/*

RESOURCES += \
    resources.qrc

# Additional import path used to resolve QML modules in Qt Creator's code model
QML_IMPORT_PATH = content/

# Default rules for deployment.
include(deployment.pri)

#DISTFILES += \
#    content/invaderAI.js \
#    content/physicsEngine.js \
#    content/aabb.js \
#    content/physicsObject.js \
#    content/vector2d.js \
#    content/invaderPhysicsModel.js \
#    content/invader.js \
#    content/PhysicsDebugBox.qml \
#    content/playerPhysicsModel.js \
#    content/invaderLaserProjectile.js \
#    content/invaderLaserProjectilePhysicsModel.js \
#    content/playerLaserProjectile.js \
#    content/playerLaserProjectilePhysicsModel.js \
#    content/Highscores.qml \
#    content/KeybindingDelegate.qml \
#    content/Explosion.qml

DISTFILES += \
    content/ActiveGameView.qml \
    content/GameOverView.qml \
    content/GameDebugOverlay.qml
