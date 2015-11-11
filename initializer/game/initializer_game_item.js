// This module deals with game items
var ManagerSceneItem = {
  curr_items: {},

  Item: function(type) {
    this.category = type;
    this.curr_location = LayoutSideNeutral;
    this.prev_location = LayoutSideNeutral;
    this.icon = null;

    this.export_location = function(type) {
      if (type == 'reverse') {
        // export location in reversed order
        return (LayoutNoGridY - this.curr_location - 1);
      } else {
        return this.curr_location;
      }
    };
  },

  // create item helper
  CreateItem: function(type) {
    var item = new this.Item(type);
    if (this.curr_items[type] == null) {
      this.curr_items[type] = [];
    }
    this.curr_items[type].push(item);
    return item;
  },

  // other item related logic
  // export items into JSON string
  ExportItemsInformation: function() {
    return JSON.stringify(this.curr_items);
  },

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

  // compare if two item list are the same
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

  // reset current items location to previous items location
  ResetLocation: function() {
    for (var k in this.curr_items) {
      for (var i = 0; i < this.curr_items[k].length; i++) {
        this.curr_items[k][i].curr_location =
          this.curr_items[k][i].prev_location;
      }
    }
  },

  // backup current items location to previous items location
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
};