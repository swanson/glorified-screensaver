function addAnnouncement() {
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
}
