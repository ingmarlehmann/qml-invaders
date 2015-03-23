import QtQuick 2.0
import "objectFactory.js" as ObjectFactory

Rectangle {
    id: root
    width: parent.width
    height: parent.height

    color: "black"

    signal quit()

    function newGame(){
        createEnemyShips();
    }

    property int shipX: (parent.width/2)-(playerShip.width/2)
    property int moveDir: constants.movedir_none

    property double lastUpdateTime: 0
    property real step: 0.8

    property var projectiles: []
    property var enemyShips: []

    property int score: 0

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
        running: true
        repeat: true
        onTriggered: {
            var currentTime = new Date().getTime();
            var dT = (currentTime - lastUpdateTime);

            // Move player ship.
            if(moveDir === constants.movedir_left){
                root.shipX = Math.max(0, root.shipX - (root.step * dT));
                //console.log("moving ship left. dT: " + dT + " step: " + root.step + " move len: " + (root.step*dT) + " abs pos: " + root.shipX);
            } else if(moveDir === constants.movedir_right){
                root.shipX = Math.min(parent.width-playerShip.width, root.shipX + (root.step * dT));
                //console.log("moving ship right. dT: " + dT + " step: " + root.step + " move len: " + (root.step*dT) + " abs pos: " + root.shipX);
            }

            // Update player projectiles
            for(var i=(projectiles.length-1); i>=0; --i){

                var projectileDeleted = false;

                for(var j=0; j< enemyShips.length; ++j){
                    if(enemyShips[j].opacity !== 0){

                        //console.log("testing enemy ship " + j + " against projectile " + i);
                        var box1 = projectiles[i].physicsBody;
                        var box2 = enemyShips[j].physicsBody;

                        var collides = box1.testCollision(box2);
                        if(collides){
                            //console.log(" - enemy ship " + j + " collides with projectile " + i);
                            enemyShips[j].opacity = 0;
                            enemyShips[j].lastCollision = currentTime;

                            // update score.
                            score += 10;
                            scoreText.text = leftPad(score,4);

                            // destroy qml object.
                            projectiles[i].destroy();

                            // remove this projectile reference from the collection.
                            projectiles.splice(i, 1);

                            projectileDeleted = true;
                            break;
                        }
                    }
                }

                if(projectileDeleted === false){
                    projectiles[i].y = Math.max(0, projectiles[i].y - (root.step * dT));
                }
            }

            // Remove all projectiles that have a y value under 5 (y=0 is top of screen).
            projectiles = projectiles.filter( function(value, index, array) {
                if(value.y <= 5){
                    value.destroy();
                }

                return value.y > 5;
            } );

            lastUpdateTime = new Date().getTime();
        }
    }

    PlayerShip{
        id: playerShip
        x: root.shipX
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


    Keys.onEscapePressed: {
        quit()
    }

    Keys.onPressed: {
        if(event.key === Qt.Key_Left){
            if(!event.isAutoRepeat){
                moveDir |= constants.movedir_left;
            }

            event.accepted = true;
        }
        if(event.key === Qt.Key_Right){
            if(!event.isAutoRepeat){
                moveDir |= constants.movedir_right;
            }

            event.accepted = true;
        }
    }

    Keys.onReleased: {
        if(event.key === Qt.Key_Left){
            if(!event.isAutoRepeat){
                moveDir &= ~(constants.movedir_left);
            }
        }

        if(event.key === Qt.Key_Right){
            if(!event.isAutoRepeat){
                moveDir &= ~(constants.movedir_right);
            }
        }

        if(event.key === Qt.Key_Q){
            event.accepted = true;
            doQuit();
        }

        if(event.key === Qt.Key_F){
            fpsMonitor.toggle();
        }

        if(event.key === Qt.Key_P){
            togglePhysicsDebug();
        }

        if(event.key === Qt.Key_Space){
            if(!event.isAutoRepeat){
                var objectName = "playerProjectile";
                var projectileStartX = playerShip.x + (playerShip.width/2);
                var projectileStartY = root.height - (playerShip.height+30);
                var completedCallback = function(newObject) {
                    if(newObject) {
                        projectiles.push(newObject);
                        //newObject.y = 0;
                    } else {
                        console.log("error creating object" + objectName);
                    }
                }

                ObjectFactory.createObject(
                            objectName,
                            { x: projectileStartX, y: projectileStartY },
                            root, // object parent
                            completedCallback );
            }
        }
    }

    function createEnemyShips() {
        for(var x=0; x< 500; x+=50){
            for(var y=100; y< 400; y+=50){
                createEnemyShip("enemyShip1", x + 50, y);
            }
        }
    }

    function createEnemyShip(shipType, posX, posY) {
        var completedCallback = function(newObject) {
            if(newObject) {
                //console.log("info: Created object " + objectName);
                //console.log("(createEnemyShip())EnemyShip:PhysicsBody x: " + newObject.x + " y: " + newObject.y + " width: " + newObject.width + " height: " + newObject.height);
                enemyShips.push(newObject);
            } else {
                console.log("ERROR: Error creating object " + objectName);
            }


        }

        ObjectFactory.createObject(
                    shipType,
                    { x: posX, y: posY },
                    root, // object parent
                    completedCallback );

    }

    function clearGameData(){

        for(var i=0; i< projectiles.length; ++i){
            projectiles[i].destroy();
        }
        projectiles = [];

        for(var j=0; j< enemyShips.length; ++j){
            enemyShips[j].destroy();
        }
        enemyShips = [];

        root.shipX = (parent.width/2)-(playerShip.width/2);

        score = 0;
        scoreText.text = "0000";
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

        //Do some cleanup
        clearGameData();

        // Emit the quit signal for parents.
        quit();
    }

    Item{
        id: constants

        readonly property int movedir_none:     (0<<0)
        readonly property int movedir_left:     (1<<0)
        readonly property int movedir_right:    (1<<1)
    }
}

