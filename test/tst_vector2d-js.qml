import QtQuick 2.3
import QtTest 1.0

import "../content/vector2d.js" as Vector2d

TestCase {
    name: "Vector2d tests"

    property var vector2d: null

    function test_vector2d_no_parameters() {
      vector2d = Vector2d.create();
      compare(vector2d.x, 0, 'vector2d.x = 0');
      compare(vector2d.y, 0, 'vector2d.y = 0');
      vector2d = null;
    }

    function test_vector2d_zero_zero() {
      vector2d = Vector2d.create(0, 0);
      compare(vector2d.x, 0, 'vector2d.x = 0');
      compare(vector2d.y, 0, 'vector2d.y = 0');
      vector2d = null;
    }

    function test_vector2d_zero_undefined() {
      var undefVar;
      vector2d = Vector2d.create(0, undefVar);
      compare(vector2d.x, 0, 'vector2d.x = 0');
      compare(vector2d.y, 0, 'vector2d.y = 0');
      vector2d = null;
    }

    function test_vector2d_undefined_zero() {
      var undefVar;
      vector2d = Vector2d.create(undefVar, 0);
      compare(vector2d.x, 0, 'vector2d.x = 0');
      compare(vector2d.y, 0, 'vector2d.y = 0');
      vector2d = null;
    }

    function test_vector2d_null_null() {
      vector2d = Vector2d.create(null, null);
      compare(vector2d.x, 0, 'vector2d.x = 0');
      compare(vector2d.y, 0, 'vector2d.y = 0');
      vector2d = null;
    }

    function test_vector2d_null_zero() {
      vector2d = Vector2d.create(null, 0);
      compare(vector2d.x, 0, 'vector2d.x = 0');
      compare(vector2d.y, 0, 'vector2d.y = 0');
      vector2d = null;
    }

    function test_vector2d_zero_null() {
      vector2d = Vector2d.create(null, 0);
      compare(vector2d.x, 0, 'vector2d.x = 0');
      compare(vector2d.y, 0, 'vector2d.y = 0');
      vector2d = null;
    }

    function test_vector2d_one_one() {
      vector2d = Vector2d.create(1.0, 1.0);
      compare(vector2d.x, 1.0, 'vector2d.x = 1.0');
      compare(vector2d.y, 1.0, 'vector2d.y = 1.0');
      vector2d = null;
    }

    function test_vector2d_five_one() {
      vector2d = Vector2d.create(5.0, 1.0);
      compare(vector2d.x, 5.0, 'vector2d.x = 5.0');
      compare(vector2d.y, 1.0, 'vector2d.y = 1.0');
      vector2d = null;
    }

    function test_vector2d_one_five() {
      vector2d = Vector2d.create(1.0, 5.0);
      compare(vector2d.x, 1.0, 'vector2d.x = 1.0');
      compare(vector2d.y, 5.0, 'vector2d.y = 5.0');
      vector2d = null;
    }
    
  }
