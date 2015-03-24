.import "constants.js" as Constants
.import "pubsub.js" as PS

function createScore(initialScore){
    var score = (function(initialScore){
        var _exports = {};
        var _score = initialScore;
        var _scoreObservers = []

        _exports.getScore = function(){
            return _score;
        }

        _exports.setScore = function(score){
            _score = score;
            for(var i=0; i< _scoreObservers.length; ++i){
                _scoreObservers[i](_score);
            }

            //PS.PubSub.publish(Constants.TOPIC_SCORE, _score);
        }

        _exports.registerScoreObserver = function(observer){
            _scoreObservers.push(observer);
        }

        _exports.clearObservers = function(){
            _scoreObservers = [];
        }

        return _exports;

    }(initialScore));

    return score;
}
