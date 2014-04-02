// Client
$(function() {


  ////////////////////////////////////////
  //  SOCKET CONNECTION + UPDATE TABLE  //
  ////////////////////////////////////////

  //socket connection
  var socket = io.connect('http://localhost');
  socket.on('connect', function() {
    socket.emit('msg update');
  });


   //When open page, update table with list
  socket.on('msg open', function(msg){
    if(msg.length == 0){
        return;
    } else {
      $('#list').empty();
      $.each(msg, function(key, value){
        $('#list').prepend($(addOneRow(value)));
      });   
    }
  });


  /////////////////////////////////////////
  /////////   ADD AND DELETE MEMO /////////
  /////////////////////////////////////////

  //Add memo (send)
  $('#btn').click(function() {
    var message = $('#message');
    socket.emit('msg send', message.val());
  });

  //Add memo (receive)
  socket.on('msg push', function (user) {
    var date = new Date();
    $('#list').prepend($(　addOneRow(user)));
  });


 function addOneRow(user){
  return '<tr>'+
      '<td>' + user.date + '</td>'+
      '<td>' + user.message + '</td>'+
      '<td><div class="btn btn-danger" onclick="deleteMemo(\''+user._id+'\')" >DELETE</div></td>'+
      '</tr>'; 
 }


  //-------------
  // TODO set with jquery
  // Delete memo (send)
  function deleteMemo(id){ 
    alert(id);
    //socket.emit('deleteDB', id);
  }

  //Delete memo (receive)
  socket.on('db drop', function(id){
    alert(id);
    //$('#list').empty();
  });

});

