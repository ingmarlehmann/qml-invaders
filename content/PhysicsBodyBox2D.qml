import QtQuick 2.0

Item{

}

//Rectangle {
//    id: physicsBodyRoot
//    anchors.centerIn: parent
//    anchors.fill: parent

//    visible: false // comment out for debugging

//    border.color: "green"
//    color: "transparent"

//    function testCollision(other){

//        var a = {
//            x_max: parent.x + parent.width,
//            x_min: parent.x,
//            y_max: parent.y + parent.height,
//            y_min: parent.y
//        };

//        var b = {
//            x_max: other.parent.x + other.parent.width,
//            x_min: other.parent.x,
//            y_max: other.parent.y + other.parent.height,
//            y_min: other.parent.y
//        };

//        var collides = true;

//        if (a.x_max < b.x_min)
//            collides = false; // a is left of b
//        if (a.x_min > b.x_max)
//            collides = false; // a is right of b
//        if (a.y_max < b.y_min)
//            collides = false; // a is above b
//        if (a.y_min > b.y_max)
//            collides = false; // a is below b

////        if(collides){
////            console.log("testing collisions for: ");
////            console.log(" - [this]  x: " + parent.x + " y: " + parent.y + " width: " + parent.width + " height: " + parent.height);
////            console.log(" - [other] x: " + other.parent.x + " y: " + other.parent.y + " width: " + other.parent.width + " height: " + other.parent.height);
////        }

//        return collides;
//    }
//}

