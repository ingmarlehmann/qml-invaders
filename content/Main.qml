import QtQuick 2.2
import QtQuick.Controls 1.1
import QtQuick.Window 2.2
import QtQuick.Dialogs 1.2

import "constants.js" as Constants

ApplicationWindow {
    id: mainWindow

    title: qsTr("QML Invaders")

    width: Constants.GAME_WIDTH
    height: Constants.GAME_HEIGHT
    visible: true

    Rectangle{
        id: contentRoot
        color: "black"
        anchors.fill: parent
        anchors.centerIn: parent

        MainMenu{
            id: menu
            visible: true
            focus: true
            opacity: 100

            anchors.fill: parent
            anchors.centerIn: parent
        }

        Game{
            id: game
            visible: false
            focus: false

            anchors.fill: parent
            anchors.centerIn: parent
        }

        Credits{
            id: credits
            visible: false
            focus: false
            opacity: 0

            anchors.fill: parent
            anchors.centerIn: parent
        }
    }

    Component.onCompleted: {
        game.quit.connect( function(){
            exitToMainMenu()
        })

        menu.menuItemSelected.connect( function(selectedMenuItem){
            menuItemSelected(selectedMenuItem)
        })

        Constants.COMPONENT_READY = Component.Ready;
        Constants.COMPONENT_ERROR = Component.Error;
        Constants.COMPONENT_LOADING = Component.Loading;
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
