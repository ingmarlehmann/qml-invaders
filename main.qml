import QtQuick 2.4
import QtQuick.Controls 1.3
import QtQuick.Window 2.2
import QtQuick.Dialogs 1.2
import "."

ApplicationWindow {
    id: mainWindow

    title: qsTr("Hello World")
    width: 640
    height: 480
    visible: true

    Rectangle{
        id: contentRoot
        color: "blue"
        anchors.fill: parent

        MouseArea{
            anchors.fill: parent
            onClicked: {
//                if(menu.visible){
//                    game.visible = true
//                    credits.visible = false
//                    menu.visible = false
//                }
//                else if(game.visible){
//                    menu.visible = false
//                    credits.visible = true
//                    game.visible = false
//                }
//                else if(credits.visible){
//                    game.visible = false
//                    menu.visible = true
//                    credits.visible = false
//                }
            }
        }

        MainMenu{
            id: menu
            visible: true

            Component.onCompleted: {

            }
        }

        Game{
            id: game
            visible: false
        }

        Credits{
            id: credits
            visible: false
        }
    }
}
