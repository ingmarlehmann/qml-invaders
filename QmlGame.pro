TEMPLATE = app

QT += qml quick widgets

SOURCES += main.cpp

RESOURCES += qml.qrc

# Additional import path used to resolve QML modules in Qt Creator's code model
QML_IMPORT_PATH = /home/ingmar/Programs/Qt/5.4/gcc_64/qml

# Default rules for deployment.
include(deployment.pri)
