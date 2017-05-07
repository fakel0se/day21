var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var players = {};
function onConnection(socket){
  //var name = 'U' + (socket.id).toString().substr(1,4);
  
  socket.emit('connecting', socket.id);
  
  socket.emit('show players', players);
  
  socket.on('connected', function(userID, X, Y) {
	//console.log("get: ", userID, "  ", socket.id);
	players[userID] = {
		x: X,
		y: Y
	};
	console.log("add: ", socket.id, "\nnow: ", players.length, "\n");
	socket.broadcast.emit('imready', socket.id, players[userID].x, players[userID].y);
  });
  
  socket.on('disconnect', function(){
	socket.broadcast.emit('dis', socket.id);
	delete players[socket.id];
	console.log("delete: ", socket.id, "\nnow: ", players.length, "\n");
  });
  
  socket.on('button clicked', function(val){
    socket.emit('button clicked', val);
	socket.broadcast.emit('player moved', socket.id, val);
	players[socket.id].x += val;
  });  
  
};

io.on('connection', onConnection); 

http.listen(port, function(){
  console.log('listening on *:' + port);
});