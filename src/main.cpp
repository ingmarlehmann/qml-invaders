#include <QApplication>
#include <QQmlApplicationEngine>
#include <QElapsedTimer>

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);

    QQmlApplicationEngine engine;

    engine.load(QUrl(QStringLiteral("content/Main.qml")));

    return app.exec();
}
