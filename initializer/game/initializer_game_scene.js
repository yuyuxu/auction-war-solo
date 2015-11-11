// scene manager
var ManagerScene = {
  stage: null,

  canvas_default_width: -1,
  canvas_default_height: -1,

  container_grid: null,
  container_status: null,
  container_popup: null,

  label_turn: null,
  label_popup: null,

  grid_width: -1,
  grid_height: -1,

  timer_start: -1,
  timer_duration: -1,
  timer_prev_seconds: -1,
  timer_callback: null,
  timer_callback_params: null,

  Init: function() {
    // setup scene
    var canvas = document.getElementById('game-canvas');
    stage = new createjs.Stage(canvas);

    // setup canvas
    canvas_default_width = stage.canvas.width;
    canvas_default_height = stage.canvas.height;
    $(window).resize(UpdateCanvas);

    // easeljs setting
    createjs.Touch.enable(stage);
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true;
    document.onkeydown = HandleKeyDown;

    // background
    var img_bg = new createjs.Bitmap(ImageBackground);
    stage.addChild(img_bg);
    var label_side_you = new createjs.Text(': You',
                                           '40px Arial',
                                           '#000000');
    label_side_you.x = 0.5 * canvas.width;
    label_side_you.y = canvas.height - 20;
    label_side_you.textBaseline = 'bottom';
    label_side_you.textAlign = 'center';
    label_side_you.alpha = 0.2;
    var label_side_opponent = new createjs.Text('Area: Opponent',
                                                '40px Arial', '#000000');
    label_side_opponent.x = 0.5 * canvas.width;
    label_side_opponent.y = LayoutStatusBarY + 20;
    label_side_opponent.textBaseline = 'top';
    label_side_opponent.textAlign = 'center';
    label_side_opponent.alpha = 0.2;
    var label_side_neutral = new createjs.Text('Area: Neutral',
                                               '40px Arial',
                                               '#000000');
    label_side_neutral.x = 0.5 * canvas.width;
    label_side_neutral.y =
      (label_side_you.y + label_side_opponent.y) * 0.5 + 20;
    label_side_neutral.textBaseline = 'bottom';
    label_side_neutral.textAlign = 'center';
    label_side_neutral.alpha = 0.2;
    stage.addChild(label_side_you);
    stage.addChild(label_side_opponent);
    stage.addChild(label_side_neutral);
    stage_hit_area = new createjs.Shape();
    stage_hit_area.graphics.beginFill('#FFF').drawRect(0, 0,
                                                       canvas.width,
                                                       canvas.height);
    stage_hit_area.alpha = 0.01;
    stage.addChild(stage_hit_area);

    // main play ground container
    container_grid = new createjs.Container();
    container_grid.width = canvas.width;
    container_grid.height = canvas.height - LayoutStatusBarY;
    container_grid.x = 0;
    container_grid.y = LayoutStatusBarY;
    stage.addChild(container_grid);

    // status container
    container_status = new createjs.Container();
    container_status.width = canvas.width;
    container_status.height = LayoutStatusBarY;
    stage.addChild(container_status);

    // turn label
    label_turn = new createjs.Text('', 'bold 24px Arial', '#ff0000');
    label_turn.x = 10;
    label_turn.y = 0.5 * container_status.height;
    label_turn.textBaseline = 'top';
    label_turn.textAlign = 'left';
    container_status.addChild(label_turn);

    // popup window container
    container_popup = new createjs.Container();
    container_popup.width = LayoutPopupW;
    container_popup.height = LayoutPopupH;
    container_popup.x = 0.5 * container_grid.width - LayoutPopupW * 0.5;
    container_popup.y = 5;
    label_popup = new createjs.Text('', 'bold 24px Arial', '#0033ff');
    label_popup.x = container_popup.width * 0.5;
    label_popup.y = container_popup.height * 0.5;
    label_popup.textBaseline = 'middle';
    label_popup.textAlign = 'center';
    container_popup.alpha = 0;
    container_popup.addChild(label_popup);
    stage.addChild(container_popup);

    // items
    SetupItem(ManagerSceneItem.CreateItem(0));
    SetupItem(ManagerSceneItem.CreateItem(1));
    SetupItem(ManagerSceneItem.CreateItem(1));
    SetupItem(ManagerSceneItem.CreateItem(2));
    SetupItem(ManagerSceneItem.CreateItem(2));
    SetupItem(ManagerSceneItem.CreateItem(2));

    // simulation loop
    createjs.Ticker.setFPS(SimulationFPS);
    createjs.Ticker.addEventListener('tick', Tick);
  },

  // type - 0: item1 1: item2 2: item3;
  // transparent - 1: no , 0: yes
  SetupItem: function(item) {
    item.icon = new createjs.Container();
    var item_image = new createjs.Bitmap(ImageItems[item.category]);
    var hit_area = new createjs.Shape();
    item_image.image.onload = function() {
      item.icon.x -= 0.5 * item_image.image.width;
      item.icon.y -= 0.5 * item_image.image.height;
      item.icon.width = item_image.image.width;
      item.icon.height = item_image.image.height;
      hit_area.graphics.beginFill('#FFF').drawRect(0, 0,
                                                   item_image.image.width,
                                                   item_image.image.height);
      hit_area.alpha = 0.01;
    }
    item.icon.addChild(item_image);
    item.icon.addChild(hit_area);
    container_grid.addChild(item.icon);
    hit_area.on('mousedown', MousedownIcon, null, false, item);
    hit_area.on('mouseover', MouseOverIcon, null, false, item);
    hit_area.on('pressup', ReleaseIcon, null, false, item);
    hit_area.on('pressmove', PressmoveIcon, null, false, item);

    stage.update();
  },

  Redraw: function() {
    UpdateCanvas();
    UpdateGridSize();
    UpdateItemLocation();

    stage.update();
  },

 // update scene components
  UpdateCanvas: function() {
    var jCanvas = $('#game-canvas');
    var jParent = $(jCanvas).parent();
    jCanvas.attr('width', $(jParent).width());

    var tw = $(jParent).width();
    var th = $(jParent).height();
    ModuleGameRendering.stage.scaleX = tw / canvas_default_width;
    ModuleGameRendering.stage.scaleY = ModuleGameRendering.stage.scaleX;
    jCanvas.attr('height', ModuleGameRendering.stage.scaleY *
                           canvas_default_height);
  },

  UpdateGridSize: function() {
    grid_width = container_grid.width / LayoutNoGridX;
    grid_height = container_grid.height / LayoutNoGridY;
  },

  UpdateItemLocation: function() {
    for (var k in ManagerSceneItem.curr_items) {
      var no_items = ManagerSceneItem.curr_items[k].length;
      var item_array = ManagerSceneItem.curr_items[k];
      for (var i = 0; i < no_items; i++) {
        var item = item_array[i];
        item.icon.x = ModuleGameRendering.GetLocationX(k, i, no_items) -
                      ModuleGameRendering.GetCenterOffset(item)[0];
        item.icon.y =
          ModuleGameRendering.GetLocationY(item_array[i].curr_location) -
          ModuleGameRendering.GetCenterOffset(item)[1];
      }
    }

    stage.update();
  },

  // move current items given target items
  MoveItems: function(items, type) {
    if (items == null) {
      InitializerUtility.Log('MoveItems error: target items are invalid');
      return;
    }

    for (var k in ManagerSceneItem.curr_items) {
      var item_array = ManagerSceneItem.curr_items[k];
      var item_array_target = items[k];
      if (item_array.length != item_array_target.length) {
        InitializerUtility.Log('MoveItems warning: item lists size not same');
        continue;
      }

      for (var i = 0; i < item_array.length; ++i) {
        if (type == 'reverse') {
          MoveItem(item_array[i],
                   LayoutNoGridY - item_array_target[i] - 1);
        } else {
          MoveItem(item_array[i], item_array_target[i]);
        }
      }
    }
  },

  // move one item
  MoveItem: function(item, target) {
    if (target < 0 || target > (LayoutNoGridY - 1)) {
      InitializerUtility.Log(target + ' is not a valid location');
      return;
    }
    if (target == item.curr_location) {
      return;
    }

    // update location
    item.prev_location = item.curr_location;
    item.curr_location = target;

    // move
    var current_y = item.icon.y;
    var target_y = GetLocationY(item.curr_location) -
                   GetCenterOffset(item)[1];
    var duration = EffectMoveSpeed *
                   Math.abs(target_y - current_y) /
                   grid_height;
    createjs.Tween.get(item.icon, {loop: false})
      .to({y: target_y}, duration)

    stage.update();
  },

  // scene component effect
  SetComponentEffect: function(component, type, input_value, curr_value) {
    if (curr_value != null && curr_value == input_value) {
      return;
    }

    if (type == 'alpha') {
      createjs.Tween.get(component, {loop: false})
        .wait(EffectDefaultWait)
        .to({alpha: input_value}, EffectDefaultTransition)
    }

    stage.update();
  },

  // transparent - 1: no , 0: yes
  EnableComponentInGame: function(type) {
    if (type == 'game') {
      SetComponentEffect(container_grid,
                         'alpha',
                         1,
                         container_grid.alpha);
    } else if (type == 'none') {
      SetComponentEffect(container_grid,
                         'alpha',
                         EffectDefaultTransparency,
                         container_grid.alpha);
    }

    stage.update();
  },

  // label
  SetBackgroundLabel: function(index, label) {
    stage.getChildAt(index).text = label;
  },

  // render helper functions
  GetLocationX: function(x, which_item, no_items) {
    return grid_width * (which_item + 1) / (no_items + 1) + grid_width * x;
  },

  GetLocationY: function(y) {
    return grid_height * (y + 0.5);
  },

  // return [x, y] offset
  GetCenterOffset: function(item) {
    var offset = [];
    offset.push(item.icon.getChildAt(0).image.width * 0.5);
    offset.push(item.icon.getChildAt(0).image.height * 0.5);
    return offset;
  },

  // timer related functions
  // again here, ManagerScene is needed because lost of binding
  Tick: function(evt) {
    ManagerScene.stage.update(evt);
    ManagerScene.HandleTimer(createjs.Ticker.getTime());
  },

  StartTimer: function(duration, cb, params) {
    ResetTimer();
    timer_start = createjs.Ticker.getTime() / 1000;
    timer_duration = duration;
    timer_callback = cb;
    timer_callback_params = params;
  },

  ResetTimer: function() {
    timer_start = -1;
    timer_duration = -1;
    timer_callback = null;
    timer_prev_seconds = -1;
    timer_callback_params = null;
  },

  HandleTimer: function(t) {
    if (timer_start < 0) return;
    var seconds_gone = Math.ceil((t - timer_start) / 1000.0);
    timer_callback(seconds_gone, timer_callback_params);
  },

  // handlers
  HandlerCountDown: function(seconds_gone, params) {
    if (seconds_gone > timer_duration) {
      ResetTimer();
    }
    if (timer_prev_seconds < 0) {
      timer_prev_seconds = seconds_gone;
    } else {
      if (timer_prev_seconds != seconds_gone) {
        timer_prev_seconds = seconds_gone;
        var display_message = 'Game start in ' + seconds_gone + ' Seconds';
        ManagerController.DisplayMessage('game-state', display_message);
      }
    }
  },

  HandlerLabelAnimation: function(seconds_gone, params) {
    if (params == null || params.length == 0) {
      InitializerUtility('HandlerLabelAnimation: callback params is empty');
      return;
    }

    if (timer_duration > 0 && seconds_gone > timer_duration) {
      ResetTimer();
    }

    if (timer_prev_seconds < 0)  {
      timer_prev_seconds = seconds_gone;
    } else if (timer_prev_seconds != seconds_gone) {
      timer_prev_seconds = seconds_gone;
      var display_message = params[0];
      var no_dots = seconds_gone % EffectNoDots;
      for (var i = 0; i < no_dots; i++) {
        display_message += '.';
      }
      ManagerController.DisplayMessage('game-state', display_message);
    }
  },

  HandleKeyDown: function(e) {
    if (!e) {
      var e = window.event;
    }
  },

  MousedownIcon: function(evt, data) {
    var o = evt.target;
    data.offset = {x: o.x - evt.stageX, y: data.icon.y - evt.stageY};
  },

  MouseOverIcon: function(evt, data) {
    var o = evt.target;
    o.cursor = 'pointer';
    data.offset = {x: o.x - evt.stageX, y: data.icon.y - evt.stageY};
  },

  PressmoveIcon: function(evt, data) {
    var o = evt.target;
    o.cursor = 'pointer';
    data.icon.y = evt.stageY + data.offset.y;
    if (data.icon.y < 0) {
      data.icon.y = 0;
    } else if (data.icon.y > (grid_height * LayoutNoGridY)) {
      data.icon.y = grid_height * LayoutNoGridY;
    }
  },

  ReleaseIcon: function(evt, data) {
    var o = evt.target;
    o.cursor = 'arrow';
    var location = Math.floor(data.icon.y / grid_height);
    if (location >= LayoutNoGridY) {
      location = LayoutNoGridY - 1;
    }
    if (data.curr_location != location) {
      data.curr_location = location;
      ManagerController.ShowAccept('#accept-div', false);
    }
    data.icon.y = ModuleGameRendering.GetLocationY(location) -
                  ModuleGameRendering.GetCenterOffset(data)[1];
  },
};