exports.MakeId = function() {
  var text = '';
  var dictionary =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var id_length = 10;

  for (var i = 0; i < id_length; i++) {
    text += dictionary.charAt(Math.floor(Math.random() * dictionary.length));
  }
  return text;
};
