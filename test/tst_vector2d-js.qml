import QtQuick 2.3
import QtTest 1.0

import "../game/content/vector2d.js" as Vector2d

TestCase {
    name: "Vector2d"

    property var vec1: null
    property var vec2: null
    property var result: null

    function test_vector2d_no_parameters() {
        vec1 = Vector2d.create();
        compare(vec1.getX(), 0, 'vector2d.getX() = 0');
        compare(vec1.getY(), 0, 'vector2d.getY() = 0');
        vec1 = null;
    }

    function test_vector2d_zero_zero() {
        vec1 = Vector2d.create(0, 0);
        compare(vec1.getX(), 0, 'vector2d.getX() = 0');
        compare(vec1.getY(), 0, 'vector2d.getY() = 0');
        vec1 = null;
    }

    function test_vector2d_zero_undefined() {
        var undefVar;
        vec1 = Vector2d.create(0, undefVar);
        compare(vec1.getX(), 0, 'vector2d.getX() = 0');
        compare(vec1.getY(), 0, 'vector2d.getY() = 0');
        vec1 = null;
    }

    function test_vector2d_undefined_zero() {
        var undefVar;
        vec1 = Vector2d.create(undefVar, 0);
        compare(vec1.getX(), 0, 'vector2d.getX() = 0');
        compare(vec1.getY(), 0, 'vector2d.getY() = 0');
        vec1 = null;
    }

    function test_vector2d_null_null() {
        vec1 = Vector2d.create(null, null);
        compare(vec1.getX(), 0, 'vector2d.getX() = 0');
        compare(vec1.getY(), 0, 'vector2d.getY() = 0');
        vec1 = null;
    }

    function test_vector2d_null_zero() {
        vec1 = Vector2d.create(null, 0);
        compare(vec1.getX(), 0, 'vector2d.getX() = 0');
        compare(vec1.getY(), 0, 'vector2d.getY() = 0');
        vec1 = null;
    }

    function test_vector2d_zero_null() {
        vec1 = Vector2d.create(null, 0);
        compare(vec1.getX(), 0, 'vector2d.getX() = 0');
        compare(vec1.getY(), 0, 'vector2d.getY() = 0');
        vec1 = null;
    }

    function test_vector2d_one_one() {
        vec1 = Vector2d.create(1.0, 1.0);
        compare(vec1.getX(), 1.0, 'vector2d.getX() = 1.0');
        compare(vec1.getY(), 1.0, 'vector2d.getY() = 1.0');
        vec1 = null;
    }

    function test_vector2d_five_one() {
        vec1 = Vector2d.create(5.0, 1.0);
        compare(vec1.getX(), 5.0, 'vector2d.getX() = 5.0');
        compare(vec1.getY(), 1.0, 'vector2d.getY() = 1.0');
        vec1 = null;
    }

    function test_vector2d_one_five() {
        vec1 = Vector2d.create(1.0, 5.0);
        compare(vec1.getX(), 1.0, 'vector2d.getX() = 1.0');
        compare(vec1.getY(), 5.0, 'vector2d.getY() = 5.0');
        vec1 = null;
    }

    function test_vector2d_add(){
        vec1 = Vector2d.create(2.0, 5.0);
        vec2 = Vector2d.create(5.0, 1.0);
        result = Vector2d.create(0, 0);

        result.setX(vec1.getX() + vec2.getX());
        result.setY(vec1.getY() + vec2.getY());

        compare(result.getX(), 7.0, 'result = 7.0');
        compare(result.getY(), 6.0, 'result = 6.0');

        vec1 = null;
        vec2 = null;
        result = null;
    }
}
