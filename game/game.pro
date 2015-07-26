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

TARGET_PLUGIN_DIR = $${OUT_PWD}/plugins/CommonJS

mkplugindir.commands = $(MKDIR) $$TARGET_PLUGIN_DIR

cppluginmeta.commands = $(COPY) $$PWD/../external/commonjs/plugin/qmldir \
				$$PWD/../external/commonjs/LICENSE \
				$$PWD/../external/commonjs/README.md \
				$$TARGET_PLUGIN_DIR

linux-g++{
    cppluginbinary.commands = $(COPY) ../external/commonjs/plugin/libplugin.so $$TARGET_PLUGIN_DIR
}
# TODO: Add windows support

first.depends = $(first) mkplugindir cppluginmeta cppluginbinary
export(first.depends)
export(mkplugindir.commands)
export(cppluginmeta.commands)
export(cppluginbinary.commands)
QMAKE_EXTRA_TARGETS += first mkplugindir cppluginmeta cppluginbinary 

# The following code is only executed if the build is out of directory (shadow build)
!equals(PWD, $${OUT_PWD}) {
    copycontent.commands = $(COPY_DIR) $$PWD/content $$OUT_PWD
    first.depends += copycontent
    export(first.depends)
    export(copycontent.commands)
    QMAKE_EXTRA_TARGETS += first copycontent
}
