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

    states: [
        State{
            name: "pre game"
            PropertyChanges { target: gameActiveView; visible: false; }
            PropertyChanges { target: gameOverView; visible: false; }
            PropertyChanges { target: gameWonView; visible: false; }
        },

        State{
            name: "game active"
            PropertyChanges { target: gameActiveView; visible: true; }
            PropertyChanges { target: gameOverView; visible: false; }
            PropertyChanges { target: gameWonView; visible: false; }
        },
        State{
            name: "game won"
            PropertyChanges { target: gameActiveView; visible: false; }
            PropertyChanges { target: gameOverView; visible: false; }
            PropertyChanges { target: gameWonView; visible: true; }
        },
        State{
            name: "game over"
            PropertyChanges { target: gameActiveView; visible: false; }
            PropertyChanges { target: gameOverView; visible: true; }
            PropertyChanges { target: gameWonView; visible: false; }
        }
    ]

    GameActiveView{
        id: gameActiveView
        visible: false

        color: "black"

        anchors.fill: parent
        anchors.centerIn: parent
    }

    GameWonView{
        id: gameWonView
        visible: false

        color: "black"

        anchors.fill: parent
        anchors.centerIn: parent
    }

    GameOverView{
        id: gameOverView
        visible: false

        color: "black"

        anchors.fill: parent
        anchors.centerIn: parent
    }

    GameDebugOverlay{
        id: gameDebugOverlay
        visible: false

        color: "transparent"

        anchors.fill: parent
        anchors.centerIn: parent
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
            ObjectFactory.setRootQmlObject(gameActiveView);

            gameEngine = Engine.create(parent.width, parent.height);

            PS.PubSub.subscribe(Constants.TOPIC_SCORE, gameActiveView.onScoreChanged);
            PS.PubSub.subscribe(Constants.TOPIC_PLAYER_NUM_LIVES_CHANGED, gameActiveView.onNumLivesChanged);

            PS.PubSub.subscribe(Constants.TOPIC_PLAYER_DIED, gameRoot.onPlayerDied);
            PS.PubSub.subscribe(Constants.TOPIC_ALL_INVADERS_DEAD, gameRoot.onAllInvadersDead);

            PS.PubSub.subscribe(Constants.TOPIC_PLAYER_FIRED, playerFireSound.restart);
            PS.PubSub.subscribe(Constants.TOPIC_ENEMY_FIRED, enemyFireSound.restart);
            PS.PubSub.subscribe(Constants.TOPIC_ENEMY_DIED, enemyExplosionSound.restart);

            gameActiveView.shoot.connect( function(){
                gameEngine.keyUp(
                            { key: Qt.Key_Space, isAutoRepeat: false } );
            } );

            gameActiveView.moveShipLeft.connect( function(){
                gameEngine.keyDown(
                            { key: Qt.Key_Left, isAutoRepeat: false } );
            } );

            gameActiveView.moveShipRight.connect( function(){
                gameEngine.keyDown(
                            { key: Qt.Key_Right, isAutoRepeat: false } );
            } );

            gameActiveView.stopMovingLeft.connect( function(){
                gameEngine.keyUp(
                            { key: Qt.Key_Left, isAutoRepeat: false } );
            } );

            gameActiveView.stopMovingRight.connect( function(){
                gameEngine.keyUp(
                            { key: Qt.Key_Right, isAutoRepeat: false } );
            } );

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
        if(gameRoot.state === 'game active'){
            if(gameEngine){
                gameEngine.keyDown(event);
            }
        } else if(gameRoot.state === 'game over' || gameRoot.state === 'game won'){
            doQuit();
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
            gameDebugOverlay.visible = !gameDebugOverlay.visible;
            gameDebugOverlay.toggleFPSMonitor();
        }
    }

    function newGame(){
        gameRoot.state = 'pre game';

        if(gameEngine){
            gameEngine.newGame();
        }

        gameRoot.state = 'game active';
    }

    function onPlayerDied(messageTopic, value){
        gameRoot.state = 'game over';
    }

    function onAllInvadersDead(messageTopic, value){
        gameRoot.state = 'game won';
    }

    function doQuit(){

        if(gameEngine){
            gameEngine.clearGameData();
        }

        // Emit the quit signal for parents.
        quit();
    }
}

