/** Model (static, front end, game) for front end items management. */
var ManagerSceneItem = {
  /** Map that store all the items
   * @type {Object<integer, SceneItem>}
   */
  curr_items: {},

  /** API. Create item object.
   * @param {string} type - type of the item.
   */
  CreateItem: function(type) {
    var item = new SceneItem(type);
    if (this.curr_items[type] == null) {
      this.curr_items[type] = [];
    }
    this.curr_items[type].push(item);
    return item;
  },

  /** API. Expert item locations. */
  ExportItemLocations: function() {
    var item_locations = {};
    for (var k in this.curr_items) {
      item_locations[k] = [];
      var item_array = this.curr_items[k];
      for (var i = 0; i < item_array.length; ++i) {
        item_locations[k][i] = item_array[i].curr_location;
      }
    }

    return item_locations;
  },

  /** API. Check if all the items are split. */
  AreItemsSplit: function() {
    for (var k in this.curr_items) {
      var item_array = this.curr_items[k];
      for (var i = 0; i < item_array.length; ++i) {
        if (item_array[i].curr_location == LayoutSideNeutral) {
          return false;
        }
      }
    }

    return true;
  },

  /** API. Check if all the items are all one sided. */
  AreItemsOneSided: function() {
    var side = -1;
    for (var k in this.curr_items) {
      var item_array = this.curr_items[k];
      for (var i = 0; i < item_array.length; ++i) {
        var item = item_array[i];
        if (side < 0) {
          side = item_array[i].curr_location;
        } else if (side != item.curr_location) {
          return -1;
        }
      }
    }

    // return which side are the items on
    return side;
  },

  /** API. Compare two item array. */
  CompareItems: function(item_array1, item_array2) {
    if (item_array1 == null || item_array2 == null) {
      return false;
    }
    if (item_array1.length != item_array2.length) {
      return false;
    }
    for (var i = 0; i < item_array1.length; ++i) {
      if (item_array1[i] != item_array2[i]) {
        return false;
      }
    }
    return true;
  },

  /** API. Reset item locations to previous locations. */
  ResetLocation: function() {
    for (var k in this.curr_items) {
      for (var i = 0; i < this.curr_items[k].length; i++) {
        this.curr_items[k][i].curr_location =
          this.curr_items[k][i].prev_location;
      }
    }
  },

  /** API. Backup item locations into previous locations. */
  BackupLocation: function() {
    var item_has_moved = false;
    for (var k in this.curr_items) {
      var item_array = this.curr_items[k];
      for (var i = 0; i < item_array.length; i++) {
        var item = item_array[i];
        if (item.prev_location != item.curr_location) {
          item.prev_location = item.curr_location;
          item_has_moved = true;
        }
      }
    }
    return item_has_moved;
  },

  /** API. Compute current item's value.
  Return [current player item value, the other player's total item value]. */
  ComputeCurrentItemValue: function(current_side) {
    v1 = 0.0;
    v2 = 0.0;
    for (var k in this.curr_items) {
      var item_array = this.curr_items[k];
      for (var i = 0; i < item_array.length; i++) {
        if (item_array[i].curr_location == current_side) {
          v1 = v1 + ItemValue[k];
        } else if (item_array[i].curr_location != LayoutSideNeutral) {
          v2 = v2 + ItemValue[k];
        } else {
          Logger.Log('ComputeItemValue WARNING: ' +
                     'item should be fully splitted!');
          v1 = 0.0;
          v2 = 0.0;
        }
      }
    }
    Logger.Log('ComputeCurrentItemValue: ' + v1 + ' ' + v2);
    return [v1, v2];
  },

  /** API. Compute item's value given item locations.
  Return [current player item value, the other player's total item value]. */
  ComputeItemValueGivenLocations: function(item_locations, current_side) {
    v1 = 0.0;
    v2 = 0.0;
    for (var k in item_locations) {
      var item_array = item_locations[k];
      for (var i = 0; i < item_array.length; i++) {
        if (item_array[i].curr_location == current_side) {
          v1 = v1 + ItemValue[k];
        } else if (item_array[i].curr_location != LayoutSideNeutral) {
          v2 = v2 + ItemValue[k];
        } else {
          Logger.Log('ComputeItemValueGivenLocations WARNING: '+
                     'item should be fully splitted!');
          v1 = 0.0;
          v2 = 0.0;
        }
      }
    }
    Logger.Log('ComputeItemValueGivenLocations: ' + v1 + ' ' + v2);
    return [v1, v2];
  }
};