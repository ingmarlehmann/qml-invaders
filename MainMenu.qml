import QtQuick 2.4

Rectangle {
    id: root

    width: 640
    height: 480

    color: "gray"

    signal modeChange(string mode)

    Component.onCompleted: {
        console.log("Main.qml loaded.")
        console.log("parent w: " + parent.width + " parent h: " + parent.height)
        console.log("widht: " + width + " height: " + height)
    }

    function findWidestItem() {
        var widestItem = 0;
        if(menuNewGame.width > widestItem){
            widestItem = menuNewGame.width
        }
        if(menuLoadGame.width > widestItem){
            widestItem = menuLoadGame.width
        }
        if(menuShowHighScore.width > widestItem){
            widestItem = menuShowHighScore.width
        }
        if(menuQuit.width > widestItem){
            widestItem = menuQuit.width
        }

        return widestItem + 20
    }

    BorderImage{
        id: borderContainer
        source: "images/line-border-clipart-line-border-designs-showcard_border.png"

        width: parent.width - 150
        height: parent.height

        anchors.centerIn: parent

        Column{
            id: menuContainer
            anchors.centerIn: parent
            property int maxWidth: {
                var width = Math.max(menuNewGame.contentWidth,
                         menuLoadGame.contentWidth,
                         menuShowHighScore.contentWidth,
                         menuQuit.contentWidth) + 20

                console.log("width: " + width)

                return width;
            }

            MenuItem{
                id: menuNewGame
                buttonText: "New game"

                width: menuContainer.maxWidth
                anchors.horizontalCenter: parent.horizontalCenter

                Component.onCompleted: {
                    this.itemClicked.connect( function() {
                        modeChange("MODE_NEWGAME")
                    })
                }
            }
            MenuItem{
                id: menuLoadGame
                buttonText: "Load game"

                width: menuContainer.maxWidth
                anchors.horizontalCenter: parent.horizontalCenter

                Component.onCompleted: {
                    this.itemClicked.connect( function() {
                        modeChange("MODE_LOADGAME")
                    })
                }
            }
            MenuItem{
                id: menuShowHighScore
                buttonText: "Highscores"

                width: menuContainer.maxWidth
                anchors.horizontalCenter: parent.horizontalCenter

                Component.onCompleted: {
                    this.itemClicked.connect( function() {
                        modeChange("MODE_HIGHSCORE")
                    })
                }
            }
            MenuItem{
                id: menuQuit
                buttonText: "Quit"

                width: menuContainer.maxWidth
                anchors.horizontalCenter: parent.horizontalCenter

                Component.onCompleted: {
                    this.itemClicked.connect( function() {
                        modeChange("MODE_QUIT")
                    })
                }
            }
        }
    }
}

