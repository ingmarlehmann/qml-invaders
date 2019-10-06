.import "constants.js" as Constants

function create(initialScore){
    var score = (function(initialScore){

        var _exports = {};

        // ----------------
        // Private variables
        // ----------------
        var _score = initialScore;

        // ----------------
        // Public methods
        // ----------------
        _exports.getScore = function(){
            return _score;
        }

        _exports.setScore = function(score){
            _score = score;
        }

        return _exports;

    }(initialScore));

    return score;
}
