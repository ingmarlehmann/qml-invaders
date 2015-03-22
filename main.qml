import QtQuick 2.2
import QtQuick.Controls 1.1
import QtQuick.Window 2.2
import QtQuick.Dialogs 1.2
import "."

ApplicationWindow {
    id: mainWindow

    title: qsTr("QML Invaders")

    width: 640
    height: 640
    visible: true

    Rectangle{
        id: contentRoot
        color: "black"
        anchors.fill: parent

        MainMenu{
            id: menu
            visible: true
            focus: true
            opacity: 100
        }

//        Rectangle{
//            id: whiteScreen
//            color: "white"

//            width: parent.width
//            height: parent.height

//            opacity: 0

//            Behavior on opacity{
//                NumberAnimation{
//                    duration: 2000
//                }
//            }
//        }

//        Text{
//            id: whiteScreenOpacityText
//            text: whiteScreen.opacity
//            color: "red"
//            x: 10
//            y: 10
//        }

        Game{
            id: game
            visible: false
            focus: false
        }

        Credits{
            id: credits
            visible: false
            focus: false
            opacity: 0
        }
    }

    Component.onCompleted: {
        game.quit.connect( function(){
            exitToMainMenu()
        })

        menu.menuItemSelected.connect( function(selectedMenuItem){
            menuItemSelected(selectedMenuItem)
        })
    }

    function exitToMainMenu()
    {
        game.visible = false
        menu.visible = true
        credits.visible = false

        game.focus = false
        credits.focus = false
        menu.focus = true
    }

    function menuItemSelected(selectedMenuItem)
    {
        if(selectedMenuItem === "Quit"){
            Qt.quit()
        }
        else if(selectedMenuItem === "New game"){
            menu.visible = false;
            game.visible = true;

            menu.focus = false;
            game.focus = true;

            game.newGame();

            //whiteScreen.opacity = 100;
        }
        else if(selectedMenuItem === "Load game"){
            // TODO: Implement
            console.log("TODO: load game")
        }
        else if(selectedMenuItem === "Highscores"){
            // TODO: Implement
            console.log("TODO: Highscores")
        }
    }
}
