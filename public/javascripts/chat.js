// Client
$(function() {


  ////////////////////////////////////////
  //  SOCKET CONNECTION + UPDATE TABLE  //
  ////////////////////////////////////////

  //socket connection
  var socket = io.connect(window.location.hostname);
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

    //add new task
    $('#list').prepend($(　addOneRow(user)));

    //initialize message input
    $("#message").val("");
  });


 function addOneRow(user){
  var dat = new Date(user.date);//.format("YYYY-MM-DD HH:mm")
  var month = dat.getMonth()+1;
  var day = dat.getDate();

  var dat_display = month + "/" + day ;

  return '<tr>'+
      '<td>' + dat_display + '</td>'+
      '<td>' + user.message + '</td>'+
      '<td><div class="btn btn-danger" id="'+user._id+'" >DELETE</div></td>'+
      '</tr>'; 
 }



  //Delete memo (send)
  $("#list > tbody > tr > td > div").live('click', function(){
    var id = $(this).attr("id") ;
    socket.emit('delete msg', id);
  });

  //Delete memo (receive)
  socket.on('db drop', function(id){
    $("#list > tbody > tr").each(function(){
      var div_id = $(this).find("td > div").attr("id");
      if(id == div_id){
        $(this).remove();
      }
    });


  });

});

