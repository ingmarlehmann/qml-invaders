import QtQuick 2.2
import QtMultimedia 5.0

Rectangle {
    id: root

    width: parent.width
    height: parent.height

    color: "black"

    // This signal is fired when one of the menu options
    // is selected either by keyboard or mouse input.
    signal menuItemSelected(string selectedMenuItem)

    property int hoveredMenuItem: 99

    Audio{
        id: menuMusic
        source: "music/01-title-screen.mp3"
        Component.onCompleted: {
            //menuMusic.play();
        }
    }

    Audio{
        id: menuSelectSound
        source: "sound/menuSelect.wav"
    }

    ListModel{
        id: menuModel

        ListElement{ text: "New game"; highlighted: false; }
        ListElement{ text: "Load game"; highlighted: false; }
        ListElement{ text: "Highscores"; highlighted: false; }
        ListElement{ text: "Quit"; highlighted: false; }
    }

    Rectangle{
        id: borderContainer
        anchors.centerIn: parent

        color: "black"

        width: parent.width - 150
        height: parent.height

        Column{
            id: mainColumn
            anchors.centerIn: parent
            spacing: 50

            Image{
                id: topLogo
                fillMode: Image.PreserveAspectFit
                source: "qrc:/content/images/space_invaders_logo.png"
                width: 400
            }

            Column{
                id: menuContainer
                anchors.horizontalCenter: parent.horizontalCenter

                property int maxWidth: 0

                Repeater{
                    model: menuModel

                    MenuItem{
                        id: currentItem
                        buttonText: text
                        width: menuContainer.maxWidth
                        anchors.horizontalCenter: parent.horizontalCenter

                        // connect the model hovered changes to the apropriate menu options hovered.
                        Connections{
                            target: menuModel.get(index)
                            onHighlightedChanged: {
                                if(menuModel.get(index).highlighted){
                                    currentItem.highlighted = true;
                                } else {
                                    currentItem.highlighted = false;
                                }
                            }
                        }

                        // The menu item was clicked, signal parents.
                        onItemClicked: {
                            menuItemSelected(buttonText);
                        }

                        // The menu item was hovered. Set the curent selected index,
                        // which will fire an event chain to deactivate the other
                        // menu items.
                        onHoveredChanged: {
                            if(currentItem.hovered){
                                hoveredMenuItem = index;
                                menuSelectSound.stop();
                                menuSelectSound.play();
                            }
                        }

                        // Recalculate size dynamically when the content width of one of the menu
                        // options changes.
                        onContentWidthChanged: {
                            menuContainer.maxWidth = Math.max(menuContainer.maxWidth, contentWidth) + 20;
                        }
                    }
                }
            }
        }
    }

    Component.onCompleted: {
        hoveredMenuItem = 0;
    }

    // hoveredMenuItem change event controls:
    // 1. which menu option is highlighted.
    // 2. that the other menu options get de-highlighted.
    onHoveredMenuItemChanged: {
        // Deselect all the other menu items, otherwise the user kan press key down a couple of times
        // and the selection stays if the mouse hovers another menu option.
        for(var modelIndex=0; modelIndex<menuModel.count; ++modelIndex){
            if(modelIndex !== hoveredMenuItem){
                menuModel.setProperty(modelIndex, "highlighted", false);
            }
            else {
                menuModel.setProperty(modelIndex, "highlighted", true);
            }
        }
    }

    Keys.onReturnPressed: {
        menuMusic.stop();

        // Select the current menu choice
        menuItemSelected(menuModel.get(hoveredMenuItem).text);
    }

    Keys.onUpPressed: {
        // Select the previous menu item.
        if(hoveredMenuItem > 0){
            --hoveredMenuItem;
        }
        else {
            hoveredMenuItem = menuModel.count-1;
        }
    }

    Keys.onDownPressed: {
        // Select the next menu item.
        if(hoveredMenuItem < menuModel.count-1){
            ++hoveredMenuItem;
        }
        else {
            hoveredMenuItem = 0;
        }
    }

    Keys.onPressed: {
        if(event.key === Qt.Key_Q){
            event.accepted = true;
        }
    }

    Keys.onReleased: {
        if(event.key === Qt.Key_Q){
            hoveredMenuItem = 3;
            event.accepted = true;
        }
    }
}

