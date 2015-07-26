import QtQuick 2.3
import QtTest 1.0

import "../game/content/aabb.js" as AABB
import "../game/content/vector2d.js" as Vector2d

TestCase {
    name: "AABB tests"

    property var aabb1: null
    property var aabb2: null
    property var aabbOut: null

    function cleanup() {
        aabb1 = null;
        aabb2 = null;
        aabbOut = null;
    }

    function test_physicsObjectType() {
        aabb1 = AABB.create(0, 0, Vector2d.create(0,0));
        compare(aabb1.getType(), 'aabb', "aabb.type = 'aabb'");
    }

    function test_aabb_no_parameters() {
        aabb1 = AABB.create();
        compare(aabb1.getPosition().getX(), 0, 'aabb.GetPosition().getX() = 0');
        compare(aabb1.getPosition().getY(), 0, 'aabb.GetPosition().getY() = 0');

        compare(aabb1.getX(), 0, 'aabb.GetX() = 0');
        compare(aabb1.getY(), 0, 'aabb.GetY() = 0');

        compare(aabb1.getMin().getX(), 0, 'aabb.getMin().getX() = 0');
        compare(aabb1.getMin().getY(), 0, 'aabb.getMin().getY() = 0');

        compare(aabb1.getMax().getX(), 0, 'aabb.getMax().getX() = 0');
        compare(aabb1.getMax().getY(), 0, 'aabb.getMax().getY() = 0');

        compare(aabb1.getWidth(), 0, 'aabb.getWidth() = 0');
        compare(aabb1.getHeight(), 0, 'aabb.getHeight() = 0');

        compare(aabb1.getType(), 'aabb', "aabb.getType() = 'aabb'");
    }

    function test_aabb_null_parameters() {
        aabb1 = AABB.create(null, null, Vector2d.create(null, null));
        compare(aabb1.getPosition().getX(), 0, 'aabb.GetPosition().getX() = 0');
        compare(aabb1.getPosition().getY(), 0, 'aabb.GetPosition().getY() = 0');

        compare(aabb1.getX(), 0, 'aabb.GetX() = 0');
        compare(aabb1.getY(), 0, 'aabb.GetY() = 0');

        compare(aabb1.getMin().getX(), 0, 'aabb.getMin().getX() = 0');
        compare(aabb1.getMin().getY(), 0, 'aabb.getMin().getY() = 0');

        compare(aabb1.getMax().getX(), 0, 'aabb.getMax().getX() = 0');
        compare(aabb1.getMax().getY(), 0, 'aabb.getMax().getY() = 0');

        compare(aabb1.getWidth(), 0, 'aabb.getWidth() = 0');
        compare(aabb1.getHeight(), 0, 'aabb.getHeight() = 0');

        compare(aabb1.getType(), 'aabb', "aabb.getType() = 'aabb'");
    }

    function test_aabb_undefined_parameters() {
        var undefVar;

        aabb1 = AABB.create(undefVar, undefVar, Vector2d.create(undefVar, undefVar));
        compare(aabb1.getPosition().getX(), 0, 'aabb.GetPosition().getX() = 0');
        compare(aabb1.getPosition().getY(), 0, 'aabb.GetPosition().getY() = 0');

        compare(aabb1.getX(), 0, 'aabb.GetX() = 0');
        compare(aabb1.getY(), 0, 'aabb.GetY() = 0');

        compare(aabb1.getMin().getX(), 0, 'aabb.getMin().getX() = 0');
        compare(aabb1.getMin().getY(), 0, 'aabb.getMin().getY() = 0');

        compare(aabb1.getMax().getX(), 0, 'aabb.getMax().getX() = 0');
        compare(aabb1.getMax().getY(), 0, 'aabb.getMax().getY() = 0');

        compare(aabb1.getWidth(), 0, 'aabb.getWidth() = 0');
        compare(aabb1.getHeight(), 0, 'aabb.getHeight() = 0');

        compare(aabb1.getType(), 'aabb', "aabb.getType() = 'aabb'");
    }

    function test_aabb_w10_h20_x30_y40() {
        var width = 10;
        var height = 20;
        var x = 30;
        var y = 40;

        var position = Vector2d.create(x, y);

        aabb1 = AABB.create(width, height, position);

        compare(aabb1.getPosition().getX(), x, 'aabb.GetPosition().getX() = 30');
        compare(aabb1.getPosition().getY(), y, 'aabb.GetPosition().getY() = 40');

        compare(aabb1.getX(), x, 'aabb.GetX() = 30');
        compare(aabb1.getY(), y, 'aabb.GetY() = 40');

        compare(aabb1.getMin().getX(), x, 'aabb.getMin().getX() = 30');
        compare(aabb1.getMin().getY(), y, 'aabb.getMin().getY() = 40');

        compare(aabb1.getMax().getX(), x+width, 'aabb.getMax().getX() = 40');
        compare(aabb1.getMax().getY(), y+height, 'aabb.getMax().getY() = 60');

        compare(aabb1.getWidth(), width, 'aabb.getWidth() = 10');
        compare(aabb1.getHeight(), height, 'aabb.getHeight() = 20');

        compare(aabb1.getType(), 'aabb', "aabb.getType() = 'aabb'");
    }

    function test_aabb_merge() {
        var aabb1params = {
            width: 10,
            height: 10,
            x: 0,
            y: 10 };

        var aabb2params = {
            width: 10,
            height: 10,
            x: 50,
            y: 60 };

        var pos1 = Vector2d.create(aabb1params.x, aabb1params.y);
        var pos2 = Vector2d.create(aabb2params.x, aabb2params.y);

        aabb1 = AABB.create(aabb1params.width, aabb1params.height, pos1);
        aabb2 = AABB.create(aabb2params.width, aabb2params.height, pos2);

        aabbOut = aabb1.merge(aabb2);

        compare(aabbOut.getMin().getX(), 0, 'aabb.getMin().getX() = 0');
        compare(aabbOut.getMin().getY(), 10, 'aabb.getMin().getY() = 10');

        compare(aabbOut.getMax().getX(), 60, 'aabb.getMax().getX() = 60'); // max.x = x + width
        compare(aabbOut.getMax().getY(), 70, 'aabb.getMax().getY() = 70'); // max.y = y + height
    }

    function test_aabb_move(){
        var aabb1params = {
            width: 10,
            height: 10,
            x: 0,
            y: 10 };

        var newX = 10;
        var newY = 20;

        aabb1 = AABB.create(aabb1params.width, aabb1params.height, Vector2d.create(aabb1params.x, aabb1params.y));

        aabb1.setX(newX);
        aabb1.setY(newY);

        compare(aabb1.getPosition().getX(), newX, 'aabb.GetPosition().getX() = 10');
        compare(aabb1.getPosition().getY(), newY, 'aabb.GetPosition().getY() = 20');

        compare(aabb1.getX(), newX, 'aabb.GetX() = 10');
        compare(aabb1.getY(), newY, 'aabb.GetY() = 20');

        compare(aabb1.getMin().getX(), newX, 'aabb.getMin().getX() = 10');
        compare(aabb1.getMin().getY(), newY, 'aabb.getMin().getY() = 20');

        compare(aabb1.getMax().getX(), newX + aabb1params.width, 'aabb.getMax().getX() = 20');
        compare(aabb1.getMax().getY(), newY + aabb1params.height, 'aabb.getMax().getY() = 30');

        compare(aabb1.getWidth(), aabb1params.width, 'aabb.getWidth() = 10');
        compare(aabb1.getHeight(), aabb1params.height, 'aabb.getHeight() = 10');

        compare(aabb1.getType(), 'aabb', "aabb.getType() = 'aabb'");
    }
}
