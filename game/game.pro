TEMPLATE = app

TARGET = ../build/qml-invaders

QT += qml quick widgets

RESOURCES += \
    resources.qrc

SOURCES += main.cpp

linux-g++{
    QMAKE_POST_LINK += $$quote(mkdir -p ../build/plugins/CommonJS ../build/$$escape_expand(\n\t))
    
    COMMON_JS_FILES += \
        ../external/commonjs/plugin/libplugin.so \
        ../external/commonjs/plugin/qmldir \
	../external/commonjs/LICENSE \
	../external/commonjs/README.md
    for(FILE,COMMON_JS_FILES){
        QMAKE_POST_LINK += $$quote(cp $${FILE} ../build/plugins/CommonJS/$$escape_expand(\n\t))
    }

    QMAKE_POST_LINK += $$quote(cp -R content/ ../build/$$escape_expand(\n\t))
}

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
