import QtQuick 2.0
import "gameEngine.js" as Engine

Rectangle {
    id: root

    anchors.fill: parent
    anchors.centerIn: parent

    color: "black"

    signal quit()

    property var gameEngine: null

    FPSMonitor{
        id: fpsMonitor

        color: "white"
        font.pixelSize: 24

        x: parent.width - (fpsMonitor.contentWidth) - 10
        y: 10
    }

    Timer{
        id: moveTimer
        interval: 16 // 16ms is maximum resolution at 60 fps.
        running: (root.visible)
        repeat: true
        onTriggered: {
            if(gameEngine){
                gameEngine.update();
            }
        }
    }

    PlayerShip{
        id: playerShip

        x: getShipPosition()

        onXChanged: {
            console.log("ship position changed to: " + x);
        }

        function getShipPosition() {
            if(gameEngine){
                console.log("using game engine ship position.");
                console.log("gameEngine.player: " + gameEngine.player);
                console.log("gameEngine.player.position: " + gameEngine.player.position);
                console.log("gameEngine.player.position.x: " + gameEngine.player.position.x);
                return gameEngine.player.position.x;
            } else {
                console.log("using default ship position.");
                return (parent.width/2)-(playerShip.width/2);
            }
        }
    }

    Column{
        id: scoreRow

        anchors.left: parent.left
        anchors.leftMargin: 10

        Text{
            id: scoreHeaderText
            text: "SCORE(1)"

            color: "white"
            font.pixelSize: 24
            horizontalAlignment: Text.AlignHCenter
        }
        Text{
            id: scoreText

            text: gameEngine ? leftPad(gameEngine.score(), 4) : "0000"
            color: "white"
            font.pixelSize: 24
            anchors.horizontalCenter: parent.horizontalCenter
        }
    }

    Column{
        id: hiScoreRow

        anchors.horizontalCenter: parent.horizontalCenter

        Text{
            id: hiScoreHeaderText
            text: "HI-SCORE"

            color: "white"
            font.pixelSize: 24
            horizontalAlignment: Text.AlignHCenter
        }
        Text{
            id: hiScoreText

            text: "0000"
            color: "white"
            font.pixelSize: 24
            anchors.horizontalCenter: parent.horizontalCenter
        }
    }

    onVisibleChanged: {
        if(visible){
            gameEngine = Engine.createEngine(root, parent.width, parent.height);
            console.log("game width: " + width + " height: " + height);
            console.log(" parent width: " + parent.width + " parent height: " + parent.height);
        }
    }

    onWidthChanged: {
        if(gameEngine){
            gameEngine.setWidth(width);
        }
    }

    onHeightChanged: {
        if(gameEngine){
            gameEngine.setHeight(height);
        }
    }

    Keys.onEscapePressed: {
        doQuit();
    }

    Keys.onPressed: {
        if(gameEngine){
            gameEngine.keyDown(event);
        }
    }

    Keys.onReleased: {
        if(event.key === Qt.Key_Q && !event.isAutoRepeat){
            event.accepted = true;
            doQuit();
        }

        if(event.key === Qt.Key_F && !event.isAutoRepeat){
            fpsMonitor.toggle();
        }

        if(event.key === Qt.Key_P && !event.isAutoRepeat){
            togglePhysicsDebug();
        }
    }

    function newGame(){
        if(gameEngine){
            gameEngine.newGame();
        }
    }

    function togglePhysicsDebug(){
        // TODO: implement
    }

    function leftPad(number, targetLength) {
        var output = number + '';
        while (output.length < targetLength) {
            output = '0' + output;
        }
        return output;
    }

    function doQuit(){

        if(gameEngine){
            //Do some cleanup
            gameEngine.clearGameData();
        }

        // Emit the quit signal for parents.
        quit();
    }
}

