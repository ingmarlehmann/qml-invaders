TEMPLATE = app

QT += qml quick widgets

SOURCES += src/*

OTHER_FILES += content/*

RESOURCES += \
    resources.qrc

# Additional import path used to resolve QML modules in Qt Creator's code model
QML_IMPORT_PATH = content/

# Default rules for deployment.
include(deployment.pri)

DISTFILES +=
