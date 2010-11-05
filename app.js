var express = require('express');
require('less');
require('jade');

var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
  app.use(app.router);
  app.use(express.staticProvider(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(req, res){
  res.render('index.jade', {
    locals: {
      title: 'Glorified screensaver'
    }
  });
});

app.get('/edit', function(req, res){
  res.render('edit.jade', {
    locals: {
      title: 'Edit Announcments',
      items: ['a', 'b', 'c']
    }
  });
});

app.post('/posts/add', function(req, res){
  var item = req.body['item'];
  console.log('adding ' + item);
  socket.broadcast(item);
  res.send(item, 200);
});

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}

// Socket.IO
var io = require('socket.io');
var socket = io.listen(app, {});
socket.on('connection', function(client){
  client.send("Hi!");
});

socket.on('close', function(client){
  clients.remove(client);
});

var mongoose = require('mongoose').Mongoose;
var db = mongoose.connect('mongodb://localhost/db');
