import QtQuick 2.3
import QtTest 1.0

import "../build/content/aabb.js" as AABB
import "../build/content/vector2d.js" as Vector2d

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
        compare(aabb1.getPosition().x, 0, 'aabb.GetPosition().x = 0');
        compare(aabb1.getPosition().y, 0, 'aabb.GetPosition().y = 0');

        compare(aabb1.getX(), 0, 'aabb.GetX() = 0');
        compare(aabb1.getY(), 0, 'aabb.GetY() = 0');

        compare(aabb1.getMin().x, 0, 'aabb.getMin().x = 0');
        compare(aabb1.getMin().y, 0, 'aabb.getMin().y = 0');

        compare(aabb1.getMax().x, 0, 'aabb.getMax().x = 0');
        compare(aabb1.getMax().y, 0, 'aabb.getMax().y = 0');

        compare(aabb1.getWidth(), 0, 'aabb.getWidth() = 0');
        compare(aabb1.getHeight(), 0, 'aabb.getHeight() = 0');

        compare(aabb1.getType(), 'aabb', "aabb.getType() = 'aabb'");
    }

    function test_aabb_null_parameters() {
        aabb1 = AABB.create(null, null, Vector2d.create(null, null));
        compare(aabb1.getPosition().x, 0, 'aabb.GetPosition().x = 0');
        compare(aabb1.getPosition().y, 0, 'aabb.GetPosition().y = 0');

        compare(aabb1.getX(), 0, 'aabb.GetX() = 0');
        compare(aabb1.getY(), 0, 'aabb.GetY() = 0');

        compare(aabb1.getMin().x, 0, 'aabb.getMin().x = 0');
        compare(aabb1.getMin().y, 0, 'aabb.getMin().y = 0');

        compare(aabb1.getMax().x, 0, 'aabb.getMax().x = 0');
        compare(aabb1.getMax().y, 0, 'aabb.getMax().y = 0');

        compare(aabb1.getWidth(), 0, 'aabb.getWidth() = 0');
        compare(aabb1.getHeight(), 0, 'aabb.getHeight() = 0');

        compare(aabb1.getType(), 'aabb', "aabb.getType() = 'aabb'");
    }

    function test_aabb_undefined_parameters() {
        var undefVar;

        aabb1 = AABB.create(undefVar, undefVar, Vector2d.create(undefVar, undefVar));
        compare(aabb1.getPosition().x, 0, 'aabb.GetPosition().x = 0');
        compare(aabb1.getPosition().y, 0, 'aabb.GetPosition().y = 0');

        compare(aabb1.getX(), 0, 'aabb.GetX() = 0');
        compare(aabb1.getY(), 0, 'aabb.GetY() = 0');

        compare(aabb1.getMin().x, 0, 'aabb.getMin().x = 0');
        compare(aabb1.getMin().y, 0, 'aabb.getMin().y = 0');

        compare(aabb1.getMax().x, 0, 'aabb.getMax().x = 0');
        compare(aabb1.getMax().y, 0, 'aabb.getMax().y = 0');

        compare(aabb1.getWidth(), 0, 'aabb.getWidth() = 0');
        compare(aabb1.getHeight(), 0, 'aabb.getHeight() = 0');

        compare(aabb1.getType(), 'aabb', "aabb.getType() = 'aabb'");
    }

    function test_aabb_w10_h20_x30_y40() {
      var width = 10;
      var height = 20;
      var x = 30;
      var y = 40;

      aabb1 = AABB.create(width, height, Vector2d.create(x, y));
      compare(aabb1.getPosition().x, x, 'aabb.GetPosition().x = 30');
      compare(aabb1.getPosition().y, y, 'aabb.GetPosition().y = 40');

      compare(aabb1.getX(), x, 'aabb.GetX() = 30');
      compare(aabb1.getY(), y, 'aabb.GetY() = 40');

      compare(aabb1.getMin().x, x, 'aabb.getMin().x = 30');
      compare(aabb1.getMin().y, y, 'aabb.getMin().y = 40');

      compare(aabb1.getMax().x, x+width, 'aabb.getMax().x = 40');
      compare(aabb1.getMax().y, y+height, 'aabb.getMax().y = 60');

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

      aabb1 = AABB.create(aabb1params.width, aabb1params.height, Vector2d.create(aabb1params.x, aabb1params.y));
      aabb2 = AABB.create(aabb2params.width, aabb2params.height, Vector2d.create(aabb2params.x, aabb2params.y));

      aabbOut = aabb1.merge(aabb2);

      compare(aabbOut.getMin().x, 0, 'aabb.getMin().x = 0');
      compare(aabbOut.getMin().y, 10, 'aabb.getMin().y = 10');

      compare(aabbOut.getMax().x, 60, 'aabb.getMax().x = 60'); // max.x = x + width
      compare(aabbOut.getMax().y, 70, 'aabb.getMax().y = 70'); // max.y = y + height
    }

    function test_aabb_move(){
      var aabb1params = {
        width: 10,
        height: 10,
        x: 0,
        y: 10 };

      aabb1 = AABB.create(aabb1params.width, aabb1params.height, Vector2d.create(aabb1params.x, aabb1params.y));

      aabb1.setX(10);
      aabb1.setY(20);

      compare(aabb1.getPosition().x, 10, 'aabb.GetPosition().x = 10');
      compare(aabb1.getPosition().y, 20, 'aabb.GetPosition().y = 20');

      compare(aabb1.getX(), 10, 'aabb.GetX() = 10');
      compare(aabb1.getY(), 20, 'aabb.GetY() = 20');

      compare(aabb1.getMin().x, 10, 'aabb.getMin().x = 10');
      compare(aabb1.getMin().y, 20, 'aabb.getMin().y = 20');

      compare(aabb1.getMax().x, 20, 'aabb.getMax().x = 20');
      compare(aabb1.getMax().y, 30, 'aabb.getMax().y = 30');

      compare(aabb1.getWidth(), 10, 'aabb.getWidth() = 10');
      compare(aabb1.getHeight(), 10, 'aabb.getHeight() = 10');

      compare(aabb1.getType(), 'aabb', "aabb.getType() = 'aabb'");
    }
}
