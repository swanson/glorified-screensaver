window.onload = function() {
  $('.add').click(function() {
    var text = $('#new-item').val();
    if (text) {
      $.post('/posts/add', { item: text }, 
        function(data) {
          $('#announcement-list').prepend(
              '<li><textarea disabled="disabled" class="item" id="' +
              data['id'] + '">' +
              data['payload'] +
              '</textarea>' + 
              '<button class="edit">edit</button>' +
              '<button class="delete">delete</button></li>'
          );
          $('#new-item').val('');
        });
    }
  });

  $('.delete').live('click', (function() {
    var announcement_id = $(this).parent().find('.item').attr('id');
    if (announcement_id) {
      $.post('/posts/delete', { id: announcement_id },
        function(id) {
          var parent = $('#'+id).parent();
          parent.slideUp(300, function () {
            parent.remove();
          });
        });
    }
  }));

};
