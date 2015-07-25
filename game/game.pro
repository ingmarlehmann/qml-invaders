TEMPLATE = app

TARGET = qml-invaders

QT += qml quick widgets

RESOURCES += \
    resources.qrc

SOURCES += main.cpp

linux-g++{
    QMAKE_POST_LINK += $$quote(mkdir -p plugins/CommonJS$$escape_expand(\n\t))
    
    COMMON_JS_FILES += \
        ../external/commonjs/plugin/libplugin.so \
        ../external/commonjs/plugin/qmldir \
	../external/commonjs/LICENSE \
	../external/commonjs/README.md
    for(FILE,COMMON_JS_FILES){
        QMAKE_POST_LINK += $$quote(cp $${FILE} plugins/CommonJS/$$escape_expand(\n\t))
    }
}
