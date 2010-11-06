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

  $('.edit').live('click', (function() {
    $(this).parent().find('.item').attr('disabled', false);
    $(this).removeClass().addClass('save');
    $(this).attr('innerText', 'save');
  }));

  $('.save').live('click', (function() {
    var button = $(this);
    var announcement = $(this).parent().find('.item');
    var announcement_id = announcement.attr('id');
    var new_text = announcement.val();
    if (announcement_id) {
      $.post('/posts/save', { id: announcement_id, item: new_text },
        function(id) {
          announcement.attr('disabled', true);
          button.removeClass().addClass('edit');
          button.attr('innerText', 'edit');
        }
      );
    }
  }));


};
