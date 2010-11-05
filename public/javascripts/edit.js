function addAnnouncement() {
  var text = $('#new-item').val();
  if (text) {
    $.post('/posts/add', { item: text }, 
      function(data) {
        $('#announcement-list').append('<li>' + data + '</li>');
      }
  }

}
