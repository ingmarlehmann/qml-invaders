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

    Rectangle{
        id: gameCanvas
        color: "black"
        anchors.fill: parent
        anchors.centerIn: parent

        Row{
            id: livesRow

            anchors.left: parent.left
            anchors.leftMargin: 20
            anchors.bottom: parent.bottom
            anchors.bottomMargin: 20
            spacing: 10

            function onNumLivesChanged(topic, numLives){
                firstLifeImage.visible = (numLives >= 1);
                secondLifeImage.visible = (numLives >= 2);
                thridLifeImage.visible = (numLives >= 3);
            }

            Image{
                id: firstLifeImage
                source: "qrc:/content/images/ship.png"
                width: 25
                height: 12
            }
            Image{
                id: secondLifeImage
                source: "qrc:/content/images/ship.png"
                width: 25
                height: 12
            }
            Image{
                id: thridLifeImage
                source: "qrc:/content/images/ship.png"
                width: 25
                height: 12
            }
        }

        Rectangle{
            id: bottomDividerLine

            width: Constants.GAME_WIDTH
            height: 3

            color: "green"

            anchors.bottom: parent.bottom
            anchors.bottomMargin: 35
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
    }

    Rectangle{
        id: gameoverOverlay
        color: "black"
        opacity: 0.8
        visible: false // <<-- Not visible until the game is over
        anchors.fill: parent
        anchors.centerIn: parent

        function playerDied(topic, value){
            gameoverOverlay.visible = true;
        }

        Text{
            id: gameOverText

            opacity: 1.0

            text: "Game Over"
            color: "red"

            font.pixelSize: 48

            anchors.verticalCenter: parent.verticalCenter
            anchors.verticalCenterOffset: -100
            anchors.horizontalCenter: parent.horizontalCenter
        }
    }

    Rectangle{
        id: debugLayer
        color: "transparent"
        //opacity: 0.3
        //visible: false
        anchors.fill: parent
        anchors.centerIn: parent

        FPSMonitor{
            id: fpsMonitor

            color: "green"
            font.pixelSize: 24

            x: parent.width - (fpsMonitor.contentWidth) - 10
            y: 10
        }
    }

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

    onVisibleChanged: {
        if(visible){
            ObjectFactory.setRootQmlObject(gameCanvas);

            gameEngine = Engine.create(parent.width, parent.height);

            PS.PubSub.subscribe(Constants.TOPIC_SCORE, scoreText.scoreChanged);
            PS.PubSub.subscribe(Constants.TOPIC_PLAYER_DIED, gameoverOverlay.playerDied);
            PS.PubSub.subscribe(Constants.TOPIC_PLAYER_NUM_LIVES_CHANGED, livesRow.onNumLivesChanged);

            PS.PubSub.subscribe(Constants.TOPIC_PLAYER_FIRED, playerFireSound.restart);
            PS.PubSub.subscribe(Constants.TOPIC_ENEMY_FIRED, enemyFireSound.restart);
            PS.PubSub.subscribe(Constants.TOPIC_ENEMY_DIED, enemyExplosionSound.restart);

            //gameMusic.play();
        }
        else{
            //gameMusic.stop();
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
        gameoverOverlay.visible = false;
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

