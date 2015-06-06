import QtQuick 2.0
import QtMultimedia 5.0

import "constants.js" as Constants
import "gameEngine.js" as Engine
import "pubsub.js" as PS
import "objectFactory.js" as ObjectFactory

Rectangle {
    id: gameRoot

    anchors.fill: parent
    anchors.centerIn: parent

    color: "black"

    signal quit()

    property var gameEngine: null

    Audio{
        id: gameMusic
        source: "music/03-mercury.mp3"
    }

    Audio{
        id: playerFireSound
        source: "sound/player_shoot_laser.wav"
        function restart() { playerFireSound.stop(); playerFireSound.play(); }
    }

    Audio{
        id: enemyFireSound
        source: "sound/enemy_shoot_laser.wav"
        function restart() { enemyFireSound.stop(); enemyFireSound.play(); }
    }

    Audio{
        id: enemyExplosionSound
        source: "sound/explosion1.aiff"
        function restart() { enemyExplosionSound.stop(); enemyExplosionSound.play(); }
    }

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

            function highScoreChanged(topic, newScore){
                hiScoreText.text = leftPad(newScore, 4);
            }
        }
    }

    onVisibleChanged: {
        if(visible){
            ObjectFactory.setRootQmlObject(gameRoot);

            gameEngine = Engine.createEngine(gameRoot, parent.width, parent.height);

            PS.PubSub.subscribe(Constants.TOPIC_PLAYER_POSITION, playerShip.positionChanged);
            PS.PubSub.subscribe(Constants.TOPIC_SCORE, scoreText.scoreChanged);

            PS.PubSub.subscribe(Constants.TOPIC_PLAYER_FIRED, playerFireSound.restart);
            PS.PubSub.subscribe(Constants.TOPIC_ENEMY_FIRED, enemyFireSound.restart);
            PS.PubSub.subscribe(Constants.TOPIC_ENEMY_DIED, enemyExplosionSound.restart);

            gameMusic.play();
        }
        else{
            gameMusic.stop();
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
    }

    function newGame(){
        if(gameEngine){
            gameEngine.newGame();
        }
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

