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
  timer_tick_callback: null,
  timer_tick_callback_params: null,
  timer_finish_callback: null,
  timer_finish_callback_params: null,

  Init: function() {
    // setup scene
    var canvas = document.getElementById('game-canvas');
    this.stage = new createjs.Stage(canvas);

    // setup canvas
    this.canvas_default_width = canvas.width;
    this.canvas_default_height = canvas.height;
    $(window).resize(this.UpdateCanvas);

    // easeljs setting
    createjs.Touch.enable(this.stage);
    this.stage.enableMouseOver(10);
    this.stage.mouseMoveOutside = true;
    document.onkeydown = this.HandleKeyDown;

    // background
    var image_background = new createjs.Bitmap(ImageBackground);
    this.stage.addChild(image_background);
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
    this.stage.addChild(label_side_you);
    this.stage.addChild(label_side_opponent);
    this.stage.addChild(label_side_neutral);

    stage_hit_area = new createjs.Shape();
    stage_hit_area.graphics.beginFill('#FFF').drawRect(0, 0,
                                                       canvas.width,
                                                       canvas.height);
    stage_hit_area.alpha = 0.01;
    this.stage.addChild(stage_hit_area);

    // main play ground container
    this.container_grid = new createjs.Container();
    this.container_grid.width = canvas.width;
    this.container_grid.height = canvas.height - LayoutStatusBarY;
    this.container_grid.x = 0;
    this.container_grid.y = LayoutStatusBarY;
    this.stage.addChild(this.container_grid);

    // status container
    this.container_status = new createjs.Container();
    this.container_status.width = canvas.width;
    this.container_status.height = LayoutStatusBarY;
    this.stage.addChild(this.container_status);

    // turn label
    this.label_turn = new createjs.Text('', 'bold 24px Arial', '#ff0000');
    this.label_turn.x = 10;
    this.label_turn.y = 0.5 * this.container_status.height;
    this.label_turn.textBaseline = 'top';
    this.label_turn.textAlign = 'left';
    this.container_status.addChild(this.label_turn);

    // popup window container
    this.container_popup = new createjs.Container();
    this.container_popup.width = LayoutPopupW;
    this.container_popup.height = LayoutPopupH;
    this.container_popup.x = 0.5 * this.container_grid.width -
                             LayoutPopupW * 0.5;
    this.container_popup.y = 5;
    this.label_popup = new createjs.Text('', 'bold 24px Arial', '#0033ff');
    this.label_popup.x = this.container_popup.width * 0.5;
    this.label_popup.y = this.container_popup.height * 0.5;
    this.label_popup.textBaseline = 'middle';
    this.label_popup.textAlign = 'center';
    this.container_popup.alpha = 0;
    this.container_popup.addChild(this.label_popup);
    this.stage.addChild(this.container_popup);

    // items
    this.SetupItem(ManagerSceneItem.CreateItem(0));
    this.SetupItem(ManagerSceneItem.CreateItem(1));
    this.SetupItem(ManagerSceneItem.CreateItem(1));
    this.SetupItem(ManagerSceneItem.CreateItem(2));
    this.SetupItem(ManagerSceneItem.CreateItem(2));
    this.SetupItem(ManagerSceneItem.CreateItem(2));

    // simulation loop
    createjs.Ticker.setFPS(SimulationFPS);
    createjs.Ticker.addEventListener('tick', this.Tick);

    // redraw
    this.Redraw();
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
    this.container_grid.addChild(item.icon);
    hit_area.on('mousedown', this.MousedownIcon, null, false, item);
    hit_area.on('mouseover', this.MouseOverIcon, null, false, item);
    hit_area.on('pressup', this.ReleaseIcon, null, false, item);
    hit_area.on('pressmove', this.PressmoveIcon, null, false, item);

    this.stage.update();
  },

  Redraw: function() {
    this.UpdateCanvas();
    this.UpdateGridSize();
    this.UpdateItemLocation();

    this.stage.update();
  },

  // update scene components
  // lost of binding
  UpdateCanvas: function() {
    var jCanvas = $('#game-canvas');
    var jParent = $(jCanvas).parent();
    jCanvas.attr('width', $(jParent).width());

    var tw = $(jParent).width();
    ManagerScene.stage.scaleX = tw / ManagerScene.canvas_default_width;
    ManagerScene.stage.scaleY = ManagerScene.stage.scaleX;
    jCanvas.attr('height', ManagerScene.stage.scaleY *
                           ManagerScene.canvas_default_height);
  },

  UpdateGridSize: function() {
    this.grid_width = this.container_grid.width / LayoutNoGridX;
    this.grid_height = this.container_grid.height / LayoutNoGridY;
  },

  UpdateItemLocation: function() {
    for (var k in ManagerSceneItem.curr_items) {
      var num_items = ManagerSceneItem.curr_items[k].length;
      var item_array = ManagerSceneItem.curr_items[k];
      for (var i = 0; i < num_items; i++) {
        var item = item_array[i];
        item.icon.x = this.GetLocationX(k, i, num_items) -
                      this.GetCenterOffset(item)[0];
        item.icon.y = this.GetLocationY(item_array[i].curr_location) -
                      this.GetCenterOffset(item)[1];
      }
    }

    this.stage.update();
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
                   this.grid_height;
    createjs.Tween.get(item.icon, {loop: false})
      .to({y: target_y}, duration)

    this.stage.update();
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

    this.stage.update();
  },

  // transparent - 1: no , 0: yes
  EnableComponentInGame: function(type) {
    if (type == 'game') {
      this.SetComponentEffect(this.container_grid,
                              'alpha',
                              1,
                              this.container_grid.alpha);
    } else if (type == 'none') {
      this.SetComponentEffect(this.container_grid,
                              'alpha',
                              EffectDefaultTransparency,
                              this.container_grid.alpha);
    }

    this.stage.update();
  },

  // label
  SetBackgroundLabel: function(index, label) {
    stage.getChildAt(index).text = label;
  },

  // render helper functions
  GetLocationX: function(x, which_item, num_items) {
    var location_x = this.grid_width * (which_item + 1) / (num_items + 1) +
                     this.grid_width * x;
    return location_x;
  },

  GetLocationY: function(y) {
    return this.grid_height * (y + 0.5);
  },

  // return [x, y] offset
  GetCenterOffset: function(item) {
    var offset = [];
    offset.push(item.icon.getChildAt(0).image.width * 0.5);
    offset.push(item.icon.getChildAt(0).image.height * 0.5);
    return offset;
  },

  // timer related functions
  // lost of binding
  Tick: function(evt) {
    ManagerScene.stage.update(evt);
    ManagerScene.HandleTimer(createjs.Ticker.getTime());
  },

  StartTimer: function(duration,
                       tick_cb, tick_params,
                       finish_cb, finish_params) {
    this.timer_start = createjs.Ticker.getTime() / 1000;
    this.timer_duration = duration;
    this.timer_prev_seconds = -1;
    this.timer_tick_callback = tick_cb;
    this.timer_tick_callback_params = tick_params;
    this.timer_finish_callback = finish_cb;
    this.timer_finish_callback_params = finish_params;
  },

  ResetTimer: function() {
    this.timer_start = -1;
    this.timer_duration = -1;
    this.timer_prev_seconds = -1;
    this.timer_tick_callback = null;
    this.timer_tick_callback_params = null;
    this.timer_finish_callback = null;
    this.timer_finish_callback_params = null;
  },

  // tick cb is called once per second
  // finish cb is called after duration is passed
  // lost of binding
  HandleTimer: function(t) {
    // check if timer has started
    if (ManagerScene.timer_start < 0) {
      return;
    }
    // check whether duration has passed
    var seconds_gone = Math.ceil((t - ManagerScene.timer_start) / 1000.0);
    if (ManagerScene.timer_duration > 0 &&
        seconds_gone >= ManagerScene.timer_duration) {
      if (ManagerScene.timer_finish_callback != null) {
        ManagerScene.timer_finish_callback(
          ManagerScene.timer_finish_callback_params);
      }
      ManagerScene.ResetTimer();
    }
    // check if customized ticking should happen
    if (ManagerScene.timer_prev_seconds < 0) {
      ManagerScene.timer_prev_seconds = seconds_gone;
    } else if (ManagerScene.timer_prev_seconds != seconds_gone) {
      ManagerScene.timer_prev_seconds = seconds_gone;
      if (ManagerScene.timer_tick_callback != null) {
        ManagerScene.timer_tick_callback(seconds_gone,
          ManagerScene.timer_tick_callback_params);
      }
    }
  },

  HandlerTickerGameStateMessage: function(seconds_gone, params) {
    if (params == null || params.length != 1) {
      return;
    }

    var num_dots = seconds_gone % EffectNoDots;
    for (var i = 0; i < num_dots; ++i) {
      display_message += '.';
    }

    GamePageHelper.DisplayMessage('game-state', params[0]);
  },

  // game keyboard
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


  // lost of binding
  PressmoveIcon: function(evt, data) {
    var o = evt.target;
    o.cursor = 'pointer';
    data.icon.y = evt.stageY + data.offset.y;
    if (data.icon.y < 0) {
      data.icon.y = 0;
    } else if (data.icon.y > (ManagerScene.grid_height * LayoutNoGridY)) {
      data.icon.y = ManagerScene.grid_height * LayoutNoGridY;
    }
  },

  // lost of binding
  ReleaseIcon: function(evt, data) {
    var o = evt.target;
    o.cursor = 'arrow';
    var location = Math.floor(data.icon.y / ManagerScene.grid_height);
    if (location >= LayoutNoGridY) {
      location = LayoutNoGridY - 1;
    }
    if (data.curr_location != location) {
      data.curr_location = location;
    }
    data.icon.y = ManagerScene.GetLocationY(location) -
                  ManagerScene.GetCenterOffset(data)[1];
  },
};