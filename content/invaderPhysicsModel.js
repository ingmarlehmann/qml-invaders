.import "physicsObject.js" as PhysicsObject
.import "aabb.js" as AABB

function create(options) {

    var invaderPhysicsModel = (function(){
        var _exports = {};

        _exports.physicsBody = PhysicsObject.create()

        return _exports;

    }());

    return invaderPhysicsModel;
}

