window.onload = function() {
  var s = new io.Socket(null, {port: 3000});
  var paper = Raphael(10,50,320,200);
  paper.rect(0,0,20,20);
     
  s.connect();
  s.on('message', function(data) {
    if (data['type'] == 'add') {    
      $("#announcements").append(
          '<div id=' + data['id'] +'>' + data['payload'] + '</div>'
      );
    }
    else if (data['type'] == 'delete') {
      var announcement = $('#' + data['id']);
      announcement.slideUp(300, function () {
        announcement.remove();
      });
    }
    else if (data['type'] == 'edit') {
      var announcement = $('#' + data['id']);
      announcement.html(data['payload']);
    }

  });
};

