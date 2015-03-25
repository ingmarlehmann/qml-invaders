import QtQuick 2.0

import "constants.js" as Constants
import "gameEngine.js" as Engine
import "objectFactory.js" as ObjectFactory
import "pubsub.js" as PS

Rectangle {
    id: gameRoot

    anchors.fill: parent
    anchors.centerIn: parent

    color: "black"

    signal quit()

    property var gameEngine: null
    property var objectFactory: null

    FPSMonitor{
        id: fpsMonitor

        color: "white"
        font.pixelSize: 24

        x: parent.width - (fpsMonitor.contentWidth) - 10
        y: 10
    }

    Timer{
        id: moveTimer
        interval: 16 // 16ms is maximum resolution for a timer at 60 fps.
        running: (gameRoot.visible)
        repeat: true
        onTriggered: {
            if(gameEngine){
                gameEngine.update();
            }
        }
    }

    PlayerShip{
        id: playerShip

        Component.onCompleted: {
            Constants.PLAYERSHIP_WIDTH = playerShip.width;
            Constants.PLAYERSHIP_HEIGHT = playerShip.height;
        }

        function positionChanged(topic, newPosition){
            playerShip.x = newPosition.x;
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

            function highScoreChanged(newScore){
                scoreHeaderText.text = leftPad(newScore, 4);
            }
        }
        Text{
            id: scoreText

            text: "0000"
            color: "white"
            font.pixelSize: 24
            anchors.horizontalCenter: parent.horizontalCenter

            function scoreChanged(topic, newScore){
                scoreText.text = leftPad(newScore, 4);
            }
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
            objectFactory = ObjectFactory.createObjectFactory();
            gameEngine = Engine.createEngine(gameRoot, parent.width, parent.height);

            gameEngine.setObjectFactory(objectFactory);

            PS.PubSub.subscribe(Constants.TOPIC_PLAYER_POSITION, playerShip.positionChanged);
            PS.PubSub.subscribe(Constants.TOPIC_SCORE, scoreText.scoreChanged);
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
        if(gameEngine){
            gameEngine.keyUp(event);
        }

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
            gameEngine.clearGameData();
        }

        // Emit the quit signal for parents.
        quit();
    }
}

