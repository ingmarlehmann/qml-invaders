import QtQuick 2.3
import QtTest 1.0

import "../content/aabb.js" as AABB
import "../content/vector2d.js" as Vector2d

TestCase {
    name: "AABB tests"

    property var aabb: null

    function test_physicsObjectType() {
      aabb = AABB.create(0, 0, 0);
      compare(aabb.type, 'aabb', "aabb.type = 'aabb'");
      aabb = null;
    }

    function test_construction() {
      aabb = AABB.create(0, 0, Vector2d.create(0, 0));
    }
}
