.import "constants.js" as Constants
.import "pubsub.js" as PS

function createScore(initialScore){
    var score = (function(initialScore){

        var _exports = {};
        var _score = initialScore;

        _exports.getScore = function(){
            return _score;
        }

        _exports.setScore = function(score){

            _score = score;

            PS.PubSub.publish(Constants.TOPIC_SCORE, _score);
        }

        return _exports;

    }(initialScore));

    return score;
}