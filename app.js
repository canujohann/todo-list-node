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


//Basic Authentification
var auth = express.basicAuth(function(user, pass) {     
   return (user == "johann" && pass == "8862");
},'Secret Area');

// Routes (just one)
app.get('/', auth, routes.index);

//listen application on defined port
//"process.env.PORT" is necessary when deploying in heroku env.
app.listen(process.env.PORT || 4000 , function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

//Set the db path
//"MONGOLAB_URI" is for Mongolab with heroku
//"MONGOHQ_URL" is for mongoHQ with heroku
// chat_app is for our localhost
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/todolist_app';

// MongoDB connection through mongoose
mongoose.connect(mongoUri, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + mongoUri + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + mongoUri);
  }
});

//Create a schema
var Schema = mongoose.Schema;

// User schema (model)
var MessageSchema = new Schema({
  message: String,
  date: Date
});

//Add user schema to the mongoose models
mongoose.model('Message', MessageSchema);

// get the class for the model
var Message = mongoose.model('Message');

//socket for update db
var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
  
  socket.on('msg update', function(){
    //render message
    Message.find(function(err, docs){
      socket.emit('msg open', docs);
    });
  });

  socket.on('msg send', function (msg) {
    
    //Save in DB
    var message = new Message();
    message.message  = msg;
    message.date = new Date();
    message.save(function(err) {
      if (err) { 
        console.log(err); 
      }else{
        socket.emit('msg push', message);
        socket.broadcast.emit('msg push', msg);
      }

    });

  });

  //Delete from DB
  socket.on('delete msg', function(messageId){
    Message.findOne( {'_id': messageId}, function(err,doc){
      doc.remove();
      socket.emit('db drop', messageId);
      socket.broadcast.emit('db drop', messageId);
    });
    
    
  });

  //when disconnected
  socket.on('disconnect', function() {
    console.log('disconnected');
  });

});
