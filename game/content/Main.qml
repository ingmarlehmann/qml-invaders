import QtQuick 2.2
import QtQuick.Controls 1.1
import QtQuick.Window 2.2
import QtQuick.Dialogs 1.2

import "constants.js" as Constants

ApplicationWindow {
    id: root

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

        GameView{
            id: game
            visible: false
            focus: false

            anchors.fill: parent
            anchors.centerIn: parent
        }

        Highscores{
            id: highscores
            visible: false
            focus: false

            anchors.fill: parent
            anchors.centerIn: parent
        }

        Help{
            id: help
            visible: false
            focus: false

            anchors.fill: parent
            anchors.centerIn: parent
        }
    }

    Component.onCompleted: {
        game.quit.connect( function(){
            exitToMainMenu();
        })

        help.quit.connect( function(){
            exitToMainMenu();
        })

        highscores.quit.connect( function(){
            exitToMainMenu();
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
        help.visible = false
        highscores.visible = false;

        game.focus = false
        menu.focus = true
        help.focus = false
        highscores.focus = false;
    }

    function menuItemSelected(selectedMenuItem)
    {
        if(selectedMenuItem === "Quit"){
            Qt.quit()
        }
        else if(selectedMenuItem === "New game"){
            menu.visible = false;
            help.visible = false;
            game.visible = true;
            highscores.visible = false;

            menu.focus = false;
            help.focus = false;
            game.focus = true;
            highscores.focus = false;

            game.newGame();

            //whiteScreen.opacity = 100;
        }
        else if(selectedMenuItem === "Help"){
            menu.visible = false;
            help.visible = true;
            game.visible = false;
            highscores.visible = false;

            menu.focus = false;
            help.focus = true;
            game.focus = false;
            highscores.focus = false;
        }
        else if(selectedMenuItem === "Highscores"){
            menu.visible = false;
            help.visible = false;
            game.visible = false;
            highscores.visible = true;

            menu.focus = false;
            help.focus = false;
            game.focus = false;
            highscores.focus = true;
        }
    }
}
