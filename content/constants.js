// Constants
var MOVEDIR_NONE    = (0<<0);
var MOVEDIR_LEFT    = (1<<0);
var MOVEDIR_RIGHT   = (1<<1);
var SHIP_SPEED      = 0.8;
var PROJECTILE_SPEED    = 0.8;
var PLAYERSHIP_WIDTH    = 50; // TODO: Make depend on actual player ship width.
var PLAYERSHIP_HEIGHT   = 50; // TODO: Make depend on actual player ship height.

var TOPIC_PLAYER_POSITION = "player.position";
var TOPIC_SCORE = "score";
