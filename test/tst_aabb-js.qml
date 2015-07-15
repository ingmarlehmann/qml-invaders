import QtQuick 2.3
import QtTest 1.0

import "../content/aabb.js" as AABB
import "../content/vector2d.js" as Vector2d

TestCase {
    name: "AABB tests"

    property var aabb1: null
    property var aabb2: null
    property var aabbOut: null

    function test_physicsObjectType() {
        aabb1 = AABB.create(0, 0, Vector2d.create(0,0));
        compare(aabb1.getType(), 'aabb', "aabb.type = 'aabb'");
        aabb1 = null;
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
}
