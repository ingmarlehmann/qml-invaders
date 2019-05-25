TEMPLATE = app

TARGET = qml-invaders

QT += qml quick widgets

RESOURCES += \
    resources.qrc

SOURCES += main.cpp

# The following code is only executed if the build is out of directory (shadow build)
!equals(PWD, $${OUT_PWD}) {
    copycontent.commands = $(COPY_DIR) $$shell_path($$PWD/content) $$shell_path($$OUT_PWD/content)
    first.depends += copycontent
    export(first.depends)
    export(copycontent.commands)
    QMAKE_EXTRA_TARGETS += first copycontent
}
