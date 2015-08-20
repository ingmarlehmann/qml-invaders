import QtQuick 2.0

import "constants.js" as Constants

Rectangle{
    id: root
    color: "black"

    signal moveShipLeft();
    signal moveShipRight();
    signal stopMovingLeft();
    signal stopMovingRight();
    signal shoot();

    function onHighScoreChanged(messageTopic, newScore) { hiScoreText.text = helper.leftPad(newScore, 4); }
    function onScoreChanged(messageTopic, newScore) { scoreText.text = helper.leftPad(newScore, 4); }
    function onNumLivesChanged(messageTopic, newNumberOfLives)
    {
        firstLifeImage.visible = (newNumberOfLives >= 1);
        secondLifeImage.visible = (newNumberOfLives >= 2);
        thridLifeImage.visible = (newNumberOfLives >= 3);
    }

    Row{
        id: livesRow

        anchors.left: parent.left
        anchors.leftMargin: 20
        anchors.bottom: parent.bottom
        anchors.bottomMargin: 20
        spacing: 10

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

    TouchButton{
        id: leftButton

        width: 50
        height: 50

        anchors.left: parent.left
        anchors.bottom: parent.bottom

        anchors.leftMargin: 10
        anchors.bottomMargin: 50

        source: "qrc:/content/images/left.png"

        onPressed: {
            moveShipLeft();
        }

        onReleased: {
            stopMovingLeft();
        }
    }

    TouchButton{
        id: rightButton

        width: 50
        height: 50

        anchors.left: leftButton.right
        anchors.bottom: parent.bottom

        anchors.leftMargin: 10
        anchors.bottomMargin: 50

        source: "qrc:/content/images/right.png"

        onPressed: {
            moveShipRight();
        }

        onReleased: {
            stopMovingRight();
        }
    }

    TouchButton{
        id: shootButton

        width: 50
        height: 50

        anchors.right: parent.right
        anchors.rightMargin: 10

        anchors.bottom: parent.bottom
        anchors.bottomMargin: 50

        source: "qrc:/content/images/red_button.png"

        onPressed: {
            shoot();
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

    Item{
        id: helper

        function leftPad(number, targetLength) {
            var output = number + '';
            while (output.length < targetLength) {
                output = '0' + output;
            }
            return output;
        }
    }
}
