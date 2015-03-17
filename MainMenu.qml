import QtQuick 2.2

Rectangle {
    id: root

    width: 640
    height: 480

    color: "black"

    // This signal is fired when one of the menu options
    // is selected either by keyboard or mouse input.
    signal menuItemSelected(string selectedMenuItem)

    property int hoveredMenuItem: 99

    ListModel{
        id: menuModel

        ListElement{ text: "New game"; highlighted: false; }
        ListElement{ text: "Load game"; highlighted: false; }
        ListElement{ text: "Highscores"; highlighted: false; }
        ListElement{ text: "Quit"; highlighted: false; }
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

                            console.log("item [" + index + "] " + "highlighted state changed to '" + currentItem.highlighted + "' for: " + text);
                            console.log("model highlighted value was: " + highlighted);
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

    Component.onCompleted: {
        hoveredMenuItem = 0;
    }

    // hoveredMenuItem change event controls:
    // 1. which menu option is highlighted.
    // 2. that the other menu options get de-highlighted.
    onHoveredMenuItemChanged: {
        console.log("hoveredMenuItem changed to: " + hoveredMenuItem)

        // Deselect all the other menu items, otherwise the user kan press key down a couple of times
        // and the selection stays if the mouse hovers another menu option.
        for(var modelIndex=0; modelIndex<menuModel.count; ++modelIndex){
            if(modelIndex !== hoveredMenuItem){
                console.log("setting model[" + modelIndex + "] property to 'false'")
                menuModel.setProperty(modelIndex, "highlighted", false);
            }
            else {
                console.log("setting model[" + modelIndex + "] property to 'true'")
                menuModel.setProperty(modelIndex, "highlighted", true);
            }
        }
    }

    Keys.onReturnPressed: {
        // Select the current menu choice
        menuItemSelected(menuItems[hoveredMenuItem]);
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
}

