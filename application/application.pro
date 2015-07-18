TEMPLATE = app

TARGET = ../build/qml-invaders

QT += qml quick widgets

RESOURCES += \
    resources.qrc

SOURCES += main.cpp

linux-g++{
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
