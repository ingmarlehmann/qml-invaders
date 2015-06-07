.import "physicsObject.js" as PhysicsObject
.import "aabb.js" as AABB
.import "vector2d.js" as Vector2d

function create(width, height, collisionCallback) {

    var playerLaserProjectilePhysicsModel = (function(width, height, collisionCallback){
        var _exports = {};

        var physicsBody = AABB.create(width, height, Vector2d.create(0, 0));

        var options = {
            physicsBody: physicsBody,
            collisionGroup: 'player_laser_projectile',
            testCollisionsAgainst: ['invader'] };

        var physicsObject = PhysicsObject.create(options, collisionCallback);

        _exports.physicsBody = physicsObject.physicsBody;
        _exports.collisionGroup = physicsObject.collisionGroup;
        _exports.callback = physicsObject.collisionCallback;

        return _exports;

    }(width, height, collisionCallback));

    return playerLaserProjectilePhysicsModel;
}
