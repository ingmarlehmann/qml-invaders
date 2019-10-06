
function create(options, collisionCallback){
    var physicsObject = (function(options,
                                  collisionCallback){
        var _exports = {};

        // ----------------
        // Private variables
        // ----------------
        var _deleteMe = false;

        // ----------------
        // Public methods
        // ----------------
        _exports.deleteLater = function(){
            _deleteMe = true;
        }

        _exports.isToBeDeleted = function(){
            return _deleteMe;
        }

        // ----------------
        // Public variables
        // ----------------
        _exports.physicsBody = options.physicsBody;
        _exports.collisionGroup = options.collisionGroup;
        _exports.testCollisionsAgainst = options.testCollisionsAgainst;
        _exports.collisionCallback = collisionCallback;

        return _exports;

    }(options,
      collisionCallback));

    return physicsObject;
}

