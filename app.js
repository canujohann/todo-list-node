/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , mongoose = require('mongoose');


// Express Configuration
var app = module.exports = express.createServer();
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

//In development mode, displays errors content
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


// in production mode, debug information not diplayed
app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

//for only
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/chat_app';

// MongoDB connection through mongoose
var Schema = mongoose.Schema;

//User schema
var UserSchema = new Schema({
  message: String,
  date: Date
});

mongoose.model('User', UserSchema);
mongoose.connect('mongoUri');
var User = mongoose.model('User');

//socket for update db
var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
  
  socket.on('msg update', function(){
    //render message
    User.find(function(err, docs){
      socket.emit('msg open', docs);
    });
  });

  console.log('connected');

  socket.on('msg send', function (msg) {
    
    //DBに登録
    var user = new User();
    user.message  = msg;
    user.date = new Date();
    user.save(function(err) {

      if (err) { 
        console.log(err); 
      }else{
        socket.emit('msg push', user);
        socket.broadcast.emit('msg push', msg);
      }

    });

  });

  //DBにあるメッセージを削除
  socket.on('delete msg', function(userId){

    User.findOne( {'_id': userId}, function(err,doc){
      doc.remove();
      socket.emit('db drop', userId);
      socket.broadcast.emit('db drop', userId);
    });
    
    
  });

  socket.on('disconnect', function() {
    console.log('disconnected');
  });

});
