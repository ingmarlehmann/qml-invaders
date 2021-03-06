#include <QApplication>
#include <QQmlApplicationEngine>
#include <QElapsedTimer>
#include <QtQml>

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);
    QQmlApplicationEngine engine;

    engine.addImportPath(QStringLiteral("plugins"));
    engine.load(QStringLiteral("content/Main.qml"));

    return app.exec();
}
