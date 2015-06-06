
function create(physicsBody,
                collisionGroup,
                collisionCallback) {

    var physicsObject = (function(physicsBody,
                                  collisionGroup,
                                  collisionCallback){
        var _exports = {};

        _exports.physicsBody = physicsBody;
        _exports.collisionGroup = collisionGroup;
        _exports.collisionCallback = collisionCallback;

        return _exports;

    }(physicsBody,
      collisionGroup,
      collisionCallback));

    return physicsObject;
}

