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
  var stored_items = [];
  Announcement.fetch_active().all(function(results) {
    for (i in results) {
      var id = results[i]._id.toHexString();
      var msg = results[i].body;
      stored_items.push({'payload': msg, 'id': id});
    }

    res.render('edit.jade', {
      locals: {
        title: 'Edit Announcments',
        items: stored_items
      }
    });
  });
});

app.post('/posts/add', function(req, res){
  var item = req.body['item'];
  console.log('adding ' + item);

  var a = new Announcement();
  a.body = item;
  a.is_active = 1;
  a.save();

  msg = {'payload': item, 'type': 'add', 'id': a._id.toHexString()};
  socket.broadcast(msg);
  
  res.send(msg, 200);
});

app.post('/posts/delete', function(req, res){
  var id = req.body['id'];
  console.log('removing ' + id);
  Announcement.find({_id: id}).first(function(result){
    result.is_active = 0;
    result.save();
    res.send(id, 200);
  });

  msg = {'type': 'delete', 'id': id};
  socket.broadcast(msg);
});

app.post('/posts/save', function(req, res){
  var id = req.body['id'];
  var item = req.body['item'];
  console.log('removing ' + id);
  Announcement.find({_id: id}).first(function(result){
    result.body = item;
    result.timestamp = new Date();
    result.save();
    res.send(id, 200);
  });

  msg = {'type': 'edit', 'id': id, 'payload': item};
  socket.broadcast(msg);
});



if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}

// Socket.IO
var io = require('socket.io');
var socket = io.listen(app, {});
socket.on('connection', function(client){
  Announcement.fetch_active().all(function(results) {
    for (i in results) {
      var id = results[i]._id.toHexString();
      var msg = results[i].body;
      client.send({'payload': msg, 'type':'add', 'id': id});
    }
  });
});

socket.on('close', function(client){
  clients.remove(client);
});

var mongoose = require('mongoose').Mongoose;
var db = mongoose.connect('mongodb://localhost/db');
mongoose.model('Announcement', {
  properties: ['body', 'timestamp', 'is_active'],
  methods: {
    save: function(fn) {
      this.timestamp = new Date();
      this.__super__(fn);
    }
  },
  static: {
    fetch_active: function() {
      return this.find({is_active: 1}).sort({timestamp: -1});
    }
  }
});
var Announcement = db.model('Announcement');
