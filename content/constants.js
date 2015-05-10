.pragma library

// Constants
var MOVEDIR_NONE    = (0<<0);
var MOVEDIR_LEFT    = (1<<0);
var MOVEDIR_RIGHT   = (1<<1);
var MOVEDIR_UP      = (1<<2);
var MOVEDIR_DOWN    = (1<<3);

var SHIP_SPEED          = 0.8;
var ENEMY_PROJECTILE_SPEED    = 0.3;
var PLAYER_PROJECTILE_SPEED = 0.3;
var PLAYERSHIP_WIDTH    = 50; // TODO: Make depend on actual player ship width.
var PLAYERSHIP_HEIGHT   = 50; // TODO: Make depend on actual player ship height.
var ENEMYSHIP_WIDTH     = 50; // TODO: Make depend on actual player ship height.
var ENEMYSHIP_HEIGHT    = 50; // TODO: Make depend on actual player ship height.

var INVADER_ROWS        = 5;
var INVADER_COLUMNS     = 10;

// Event topics for PubSub
var TOPIC_SCORE = "score";

var TOPIC_PLAYER_POSITION = "player.position";
var TOPIC_PLAYER_HIT = "player.hit";
var TOPIC_PLAYER_RESPAWNED = "player.respawned";
var TOPIC_PLAYER_DIED = "player.died";
var TOPIC_PLAYER_FIRED = "player.fired";

var TOPIC_ENEMY_FIRED = "enemy.fired";
var TOPIC_ENEMY_DIED = "enemy.died";

// These will get set up dynamically
// by Main.qml in Component.onCompleted.
var COMPONENT_READY;
var COMPONENT_LOADING;
var COMPONENT_ERROR;
