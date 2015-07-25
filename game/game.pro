TEMPLATE = app

TARGET = qml-invaders

QT += qml quick widgets

RESOURCES += \
    resources.qrc

SOURCES += main.cpp

DISTFILES += \
    content/aabb.js \
    content/constants.js \
    content/gameEngine.js \
    content/invader.js \
    content/invaderAI.js \
    content/invaderLaserProjectile.js \
    content/invaderLaserProjectilePhysicsModel.js \
    content/invaderPhysicsModel.js \
    content/objectFactory.js \
    content/physicsEngine.js \
    content/physicsObject.js \
    content/player.js \
    content/playerLaserProjectile.js \
    content/playerLaserProjectilePhysicsModel.js \
    content/playerPhysicsModel.js \
    content/pubsub.js \
    content/score.js \
    content/vector2d.js \
    content/EnemyProjectile.qml \
    content/EnemyShip.qml \
    content/Explosion.qml \
    content/FPSMonitor.qml \
    content/GameActiveView.qml \
    content/GameDebugOverlay.qml \
    content/GameOverView.qml \
    content/GameView.qml \
    content/GameWonView.qml \
    content/Help.qml \
    content/Highscores.qml \
    content/KeybindingDelegate.qml \
    content/Main.qml \
    content/MainMenu.qml \
    content/MenuItem.qml \
    content/PhysicsDebugBox.qml \
    content/PlayerProjectile.qml \
    content/PlayerShip.qml

commonjs_plugin.path    = $${OUT_PWD}/plugins/CommonJS
commonjs_plugin.files   +=  ../external/commonjs/plugin/qmldir \
                            ../external/commonjs/LICENSE \
                            ../external/commonjs/README.md

linux-g++{
    commonjs_plugin.files  += ../external/commonjs/plugin/libplugin.so
}

content.path = $${OUT_PWD}/content
content.files = content/*

INSTALLS += commonjs_plugin content
