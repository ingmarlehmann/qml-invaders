.import "physicsObject.js" as PhysicsObject
.import "aabb.js" as AABB
.import "vector2d.js" as Vector2d

function create(width, height, collisionCallback) {

    var invaderPhysicsModel = (function(width, height, collisionCallback){
        var _exports = {};

        var physicsBody = AABB.create(width, height, Vector2d.create(0, 0));

        var options = {
            physicsBody: physicsBody,
            collisionGroup: 'invader',
            testCollisionsAgainst: ['player_laser_projectile', 'player'] };

        var physicsObject = PhysicsObject.create(options, collisionCallback);

        for (var attrname in physicsObject){
            _exports[attrname] = physicsObject[attrname];
        }

        return _exports;

    }(width, height, collisionCallback));

    return invaderPhysicsModel;
}

