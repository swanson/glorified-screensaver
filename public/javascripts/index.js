window.onload = function() {
  var s = new io.Socket(null, {port: 3000});
  var paper = Raphael(0, 0, screen.width, screen.height);
  paper.canvas.style.zIndex = -1;
  var rect = paper.rect(0,0,20,20);
  rect.attr({fill: "#7bca1e"});
  var p = paper.path("M 8.5714283,10.394968 C 611.42856,637.1802 785.71429,-21.467813 785.71429,-21.467813 L 8.5714284,-33.352099 z").hide();
  var loop = function() {
    i = -i;
    rect.animate({rotation: 900*i}, 4000, loop).animateAlong(p, 4000, false);
  }
  var i = 1;
  loop(rect, p);

  $('#stop-it').click(function(){
    rect.stop();
  });
     
  s.connect();
  s.on('message', function(data) {
    if (data['type'] == 'add') {    
      $("#announcements").append(
          '<li id=' + data['id'] +'>' + data['payload'] + '</li>'
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

