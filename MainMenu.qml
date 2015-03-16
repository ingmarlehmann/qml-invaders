import QtQuick 2.4

Rectangle {
    id: root

    width: 640
    height: 480

    color: "black"

    // This signal is fired when one of the menu options
    // is selected either by keyboard or mouse input.
    signal menuItemSelected(string selectedMenuItem)

    property var menuItems: ["New game", "Load game", "Highscores", "Quit"]
    property int selectedMenuItem: 0

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

                return width;
            }

            MenuItem{
                id: menuNewGame
                buttonText: menuItems[0]

                width: menuContainer.maxWidth
                anchors.horizontalCenter: parent.horizontalCenter

                Component.onCompleted: {
                    this.itemClicked.connect( function() {
                        menuItemSelected(buttonText)
                    })
                    this.itemSelected.connect( function() {
                        selectedMenuItem = 0
                        menuLoadGame.deselect()
                        menuShowHighScore.deselect()
                        menuQuit.deselect()
                    })
                }
            }
            MenuItem{
                id: menuLoadGame
                buttonText: menuItems[1]

                width: menuContainer.maxWidth
                anchors.horizontalCenter: parent.horizontalCenter

                Component.onCompleted: {
                    this.itemClicked.connect( function() {
                        menuItemSelected(buttonText)
                    })
                    this.itemSelected.connect( function() {
                        selectedMenuItem = 1
                        menuNewGame.deselect()
                        menuShowHighScore.deselect()
                        menuQuit.deselect()
                    })
                }
            }
            MenuItem{
                id: menuShowHighScore
                buttonText: menuItems[2]

                width: menuContainer.maxWidth
                anchors.horizontalCenter: parent.horizontalCenter

                Component.onCompleted: {
                    this.itemClicked.connect( function() {
                        menuItemSelected(buttonText)
                    })
                    this.itemSelected.connect( function() {
                        selectedMenuItem = 2
                        menuNewGame.deselect()
                        menuLoadGame.deselect()
                        menuQuit.deselect()
                    })
                }
            }
            MenuItem{
                id: menuQuit
                buttonText: menuItems[3]

                width: menuContainer.maxWidth
                anchors.horizontalCenter: parent.horizontalCenter

                Component.onCompleted: {
                    this.itemClicked.connect( function() {
                        menuItemSelected(buttonText)
                    })
                    this.itemSelected.connect( function() {
                        selectedMenuItem = 3
                        menuNewGame.deselect()
                        menuShowHighScore.deselect()
                        menuLoadGame.deselect()
                    })
                }
            }
        }
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

    Component.onCompleted: {
        highlightMenuItem(selectedMenuItem)
    }

    Keys.onReturnPressed: {
        // Select the current menu choice
        menuItemSelected(menuItems[selectedMenuItem])
    }

    Keys.onUpPressed: {
        // Select the previous menu item.
        if(selectedMenuItem > 0){
            --selectedMenuItem
        }
        else {
            selectedMenuItem = 3
        }

        highlightMenuItem(selectedMenuItem)
    }

    Keys.onDownPressed: {
        // Select the next menu item.
        if(selectedMenuItem < 3){
            ++selectedMenuItem
        }
        else {
            selectedMenuItem = 0
        }

        highlightMenuItem(selectedMenuItem)
    }

    function highlightMenuItem(item) {
        if(item === 0){
            menuNewGame.select()
            menuLoadGame.deselect()
            menuShowHighScore.deselect()
            menuQuit.deselect()
        }
        else if(item === 1){
            menuNewGame.deselect()
            menuLoadGame.select()
            menuShowHighScore.deselect()
            menuQuit.deselect()
        }
        else if(item === 2){
            menuNewGame.deselect()
            menuLoadGame.deselect()
            menuShowHighScore.select()
            menuQuit.deselect()
        }
        else if(item === 3){
            menuNewGame.deselect()
            menuLoadGame.deselect()
            menuShowHighScore.deselect()
            menuQuit.select()
        }
    }
}

