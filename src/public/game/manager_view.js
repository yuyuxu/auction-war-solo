var ManagerView = {
  Reset: function(type) {
    if (type == 'game') {
      // reset to previous location
      ManagerSceneItem.ResetLocation();
      ManagerScene.UpdateItemLocation();
    }
  },
};