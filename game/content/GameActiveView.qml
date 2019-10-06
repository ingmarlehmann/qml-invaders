import QtQuick 2.0

import "constants.js" as Constants

Rectangle{
    id: root
    color: "black"

    function onHighScoreChanged(newScore){
        hiScoreText.text = helper.leftPad(newScore, 4); 
    }
    function onScoreChanged(newScore){ 
        scoreText.text = helper.leftPad(newScore, 4); 
    }
    function onNumLivesChanged(newNumberOfLives){
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
