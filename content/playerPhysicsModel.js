.import "physicsObject.js" as PhysicsObject
.import "aabb.js" as AABB
.import "vector2d.js" as Vector2d

function create(width, height, collisionCallback) {

    var playerPhysicsModel = (function(width, height, collisionCallback){
        var _exports = {};

        var physicsBody = AABB.create(width, height, Vector2d.create(0, 0));

        var options = {
            physicsBody: physicsBody,
            collisionGroup: 'player',
            testCollisionsAgainst: ['invader', 'invader_laser_projectile'] };

        var physicsObject = PhysicsObject.create(options, collisionCallback);

        _exports.physicsBody = physicsObject.physicsBody;
        _exports.collisionGroup = physicsObject.collisionGroup;
        _exports.callback = physicsObject.collisionCallback;

        return _exports;

    }(width, height, collisionCallback));

    return playerPhysicsModel;
}

