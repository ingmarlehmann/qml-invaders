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
    content/PlayerShip.qml \
    content/TouchButton.qml

TARGET_PLUGIN_DIR = $${OUT_PWD}/plugins/CommonJS/
TARGET_PLUGIN_DIR = $$shell_path($$TARGET_PLUGIN_DIR)

mkpath($$TARGET_PLUGIN_DIR)

cppluginmeta.commands =     $(COPY) $$shell_path($$clean_path($$PWD/../external/commonjs/plugin/qmldir)) $$TARGET_PLUGIN_DIR $$escape_expand(\n\t)
cppluginmeta.commands +=    $(COPY) $$shell_path($$clean_path($$PWD/../external/commonjs/LICENSE)) $$TARGET_PLUGIN_DIR $$escape_expand(\n\t)
cppluginmeta.commands +=    $(COPY) $$shell_path($$clean_path($$PWD/../external/commonjs/README.md)) $$TARGET_PLUGIN_DIR $$escape_expand(\n\t)

linux-g++{
    cppluginbinary.commands = $(COPY) ../external/commonjs/plugin/libplugin.so $$TARGET_PLUGIN_DIR
}
win32{
    CONFIG(debug, debug|release) {
        cppluginbinary.commands = $(COPY) $$shell_path(../external/commonjs/plugin/debug/plugind.dll) $$TARGET_PLUGIN_DIR\plugin.dll
    }
    CONFIG(release, debug|release) {
        cppluginbinary.commands = $(COPY) $$shell_path(../external/commonjs/plugin/release/plugin.dll) $$TARGET_PLUGIN_DIR
    }
}

first.depends = $(first) mkplugindir cppluginmeta cppluginbinary

export(first.depends)
export(cppluginmeta.commands)
export(cppluginbinary.commands)

QMAKE_EXTRA_TARGETS += first mkplugindir cppluginmeta cppluginbinary 

# The following code is only executed if the build is out of directory (shadow build)
!equals(PWD, $${OUT_PWD}) {
    copycontent.commands = $(COPY_DIR) $$shell_path($$PWD/content) $$shell_path($$OUT_PWD/content)
    first.depends += copycontent
    export(first.depends)
    export(copycontent.commands)
    QMAKE_EXTRA_TARGETS += first copycontent
}
