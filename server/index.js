var express = require('express'); // Get the module
var app = express();
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var config = require('./config.js');

server.listen(config.port);
