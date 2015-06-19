.import "physicsObject.js" as PhysicsObject
.import "aabb.js" as AABB
.import "vector2d.js" as Vector2d

function create(width, height, collisionCallback) {

    var playerPhysicsModel = (function(width, height, collisionCallback){
        var _exports = {};

        // ----------------
        // Private variables
        // ----------------
        var physicsBody = AABB.create(width, height, Vector2d.create(0, 0));

        var options = {
            physicsBody: physicsBody,
            collisionGroup: 'player',
            testCollisionsAgainst: ['invader', 'invader_laser_projectile'] };

        var physicsObject = PhysicsObject.create(options, collisionCallback);

        // ----------------
        // Public variables
        // ----------------
        for (var attrname in physicsObject){
            _exports[attrname] = physicsObject[attrname];
        }

        return _exports;

    }(width, height, collisionCallback));

    return playerPhysicsModel;
}

