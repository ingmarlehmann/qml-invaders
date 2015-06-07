
function create(options,
                collisionCallback) {

    var physicsObject = (function(options,
                                  collisionCallback){
        var _exports = {};

        _exports.physicsBody = options.physicsBody;
        _exports.collisionGroup = options.collisionGroup;
        _exports.testCollisionsAgainst = options.testCollisionsAgainst;
        _exports.collisionCallback = collisionCallback;

        return _exports;

    }(options,
      collisionCallback));

    return physicsObject;
}

