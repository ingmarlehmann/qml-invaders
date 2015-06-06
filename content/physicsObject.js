
function create(physicsBody,
                objectGroup,
                collisionCallback) {

    var physicsObject = (function(physicsBody,
                                  objectGroup,
                                  collisionCallback){
        var _exports = {};

        _exports.physicsBody = physicsBody;
        _exports.objectGroup = objectGroup;
        _exports.collisionCallback = collisionCallback;

        return _exports;

    }(physicsBody,
      objectGroup,
      collisionCallback));

    return physicsObject;
}

