/** Helper functions. */

/** Random an id name with given length.
 * @param {integer} id_length - Length of the id, default is 10.
 */
exports.MakeId = function(id_length) {
  if (id_length == null) {
    id_length = 10;
  }
  var text = '';
  var dictionary =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var id_length = 10;

  for (var i = 0; i < id_length; i++) {
    text += dictionary.charAt(Math.floor(Math.random() * dictionary.length));
  }

  return text;
};
