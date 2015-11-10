/**
 * This module deals with game items.
 */
var ModuleGameItems = {
  curr_items: {},
  prev_items: null,
  has_moved_items: false,

  Item: function(type) {
    this.category = type;
    this.curr_loc = 1;
    this.prev_loc = 1;

    this.export_info = function(type) {
      if (type == 'reverse')
        return (LayoutNoGridY - 1 - this.curr_loc);
      else
        return this.curr_loc;
      return LayoutSideNeutral;
    };

    this.render = function() {
      var icon = null;
    };
  },

  CreateItem: function(type) {
    var temp_item = new this.Item(type);
    if (this.curr_items[type] == null) {
      this.curr_items[type] = [];
    }
    this.curr_items[type].push(temp_item);
    return temp_item;
  },

  ExportItemsInfo: function(type) {
    var items = [];
    for (var k in this.curr_items) {
      var no_items = this.curr_items[k].length;
      var item_array = this.curr_items[k];
      for (var i = 0; i < no_items; i++) {
        items.push(item_array[i].export_info(type));
      }
    }
    return items;
  },

  IsItemSplit: function() {
    for (var k in this.curr_items) {
      var no_items = this.curr_items[k].length;
      var item_array = this.curr_items[k];
      for (var i = 0; i < no_items; i++) {
        var item = item_array[i];
        if (item.curr_loc == 1) return false;
      }
    }
    return true;
  },

  IsItemOneSide: function() {
    var loc = -1;
    for (var k in this.curr_items) {
      var no_items = this.curr_items[k].length;
      var item_array = this.curr_items[k];
      for (var i = 0; i < no_items; i++) {
        var item = item_array[i];
        if (loc < 0)
          loc = item.curr_loc;
        else if (loc != item.loc) return -1;
      }
    }
    return loc;
  },

  CompareItemInfo: function(item1, item2) {
    if (item1 == null || item2 == null) return false;
    var no_items1 = item1.length;
    var no_items2 = item2.length;
    if (no_items1 != no_items2) return false;
    for (var i = 0; i < no_items1; i++) {
      if (item1[i] != item2[i]) return false;
    }
    return true;
  },

  ResetItems: function() {
    if (this.prev_items == null)  return;

    for (var k in this.curr_items) {
      var no_items = this.curr_items[k].length;
      for (var i = 0; i < no_items; i++) {
        this.curr_items[k][i] = this.prev_items[k][i];
      }
    }
  },

  UpdatePrevLocation: function() {
    var is_same = true;
    for (var k in this.curr_items) {
      var no_items = this.curr_items[k].length;
      var item_array = this.curr_items[k];
      for (var i = 0; i < no_items; i++) {
        var item = item_array[i];
        if (item.prev_loc != item.curr_loc) {
          item.prev_loc = item.curr_loc;
          is_same = false;
        }
      }
    }
    this.has_moved_items = !is_same;
  },

  MoveItems: function(type, items) {
    if (items == null)  return;
    var counter = 0;
    for (var k in this.curr_items) {
      var no_items = this.curr_items[k].length;
      var item_array = this.curr_items[k];
      for (var i = 0; i < no_items; i++) {
        if (counter >= items.length) return;
        if (type == 'reverse')  ModuleGameRendering.MoveItem(item_array[i], LayoutNoGridY - 1 - items[counter]);
        else          ModuleGameRendering.MoveItem(item_array[i], items[counter]);
        counter += 1;
      }
    }
  },
};