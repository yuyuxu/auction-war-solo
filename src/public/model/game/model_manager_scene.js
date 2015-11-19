/** Model (static, front end, game) for front end game scene management. */
var ManagerScene = {
  // stage
  stage: null,

  // canvas
  canvas_default_width: -1,
  canvas_default_height: -1,

  // container
  container_grid: null,
  container_status: null,
  container_popup: null,

  // label
  label_turn: null,
  label_popup: null,

  // grid
  grid_width: -1,
  grid_height: -1,

  /** API. Init scene. */
  Init: function() {
    // setup scene
    var canvas = document.getElementById('game-canvas');
    this.stage = new createjs.Stage(canvas);

    // setup canvas
    this.canvas_default_width = canvas.width;
    this.canvas_default_height = canvas.height;
    $(window).resize(this.UpdateCanvas);

    // easeljs stage setting
    createjs.Touch.enable(this.stage);
    this.stage.enableMouseOver(10);
    this.stage.mouseMoveOutside = true;
    document.onkeydown = this.HandleKeyDown;

    // background
    var image_background = new createjs.Bitmap(ImageBackground);
    this.stage.addChild(image_background);

    // label
    var label_side_you = new createjs.Text('Area: You',
                                           '40px Arial',
                                           '#000000');
    label_side_you.x = 0.5 * canvas.width;
    label_side_you.y = canvas.height - 20;
    label_side_you.textBaseline = 'bottom';
    label_side_you.textAlign = 'center';
    label_side_you.alpha = 0.1;

    var label_side_opponent = new createjs.Text('Area: Opponent',
                                                '40px Arial', '#000000');
    label_side_opponent.x = 0.5 * canvas.width;
    label_side_opponent.y = LayoutStatusBarY + 20;
    label_side_opponent.textBaseline = 'top';
    label_side_opponent.textAlign = 'center';
    label_side_opponent.alpha = 0.1;

    var label_side_neutral = new createjs.Text('Area: Neutral',
                                               '40px Arial',
                                               '#000000');
    label_side_neutral.x = 0.5 * canvas.width;
    label_side_neutral.y =
      (label_side_you.y + label_side_opponent.y) * 0.5 + 20;
    label_side_neutral.textBaseline = 'bottom';
    label_side_neutral.textAlign = 'center';
    label_side_neutral.alpha = 0.1;
    this.stage.addChild(label_side_you);
    this.stage.addChild(label_side_opponent);
    this.stage.addChild(label_side_neutral);

    // stage interaction
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
    this.SetupItem(this.CreateItem(0));
    this.SetupItem(this.CreateItem(1));
    this.SetupItem(this.CreateItem(1));
    this.SetupItem(this.CreateItem(2));
    this.SetupItem(this.CreateItem(2));
    this.SetupItem(this.CreateItem(2));

    // simulation loop
    createjs.Ticker.setFPS(SimulationFPS);
    createjs.Ticker.addEventListener('tick', this.Tick);

    // redraw
    this.Redraw();
  },

  /** Setup scene item.
   * type - 0: item1 1: item2 2: item3
   * transparent - 1: no , 0: yes
   */
  SetupItem: function(item) {
    item.render['icon'] = new createjs.Container();
    var item_image = new createjs.Bitmap(ImageItems[item.category]);
    var hit_area = new createjs.Shape();
    item_image.image.onload = function() {
      item.render['icon'].x -= 0.5 * item_image.image.width;
      item.render['icon'].y -= 0.5 * item_image.image.height;
      item.render['icon'].width = item_image.image.width;
      item.render['icon'].height = item_image.image.height;
      hit_area.graphics.beginFill('#FFF').drawRect(-3, -3,
                                                   item_image.image.width + 6,
                                                   item_image.image.height + 6);
      hit_area.alpha = 0.01;
    }
    item.render['icon'].addChild(item_image);
    item.render['icon'].addChild(hit_area);
    this.container_grid.addChild(item.render['icon']);
    hit_area.on('mousedown', this.MousedownIcon, null, false, item);
    hit_area.on('mouseover', this.MouseOverIcon, null, false, item);
    hit_area.on('pressup', this.ReleaseIcon, null, false, item);
    hit_area.on('pressmove', this.PressmoveIcon, null, false, item);

    this.stage.update();
  },

  /** Redraw game scene. */
  Redraw: function() {
    this.UpdateCanvas();
    this.UpdateGridSize();
    this.UpdateItemLocation();

    this.stage.update();
  },

  /** Update canvas size. */
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

  /** Update grid size. */
  UpdateGridSize: function() {
    this.grid_width = this.container_grid.width / LayoutNoGridX;
    this.grid_height = this.container_grid.height / LayoutNoGridY;
  },

  /** Update item locations. */
  UpdateItemLocation: function() {
    for (var k in ManagerSceneItem.curr_items) {
      var num_items = ManagerSceneItem.curr_items[k].length;
      var item_array = ManagerSceneItem.curr_items[k];
      for (var i = 0; i < num_items; i++) {
        var item = item_array[i];
        item.render['icon'].x = this.GetLocationX(k, i, num_items) -
                                this.GetCenterOffset(item)[0];
        item.render['icon'].y = this.GetLocationY(item_array[i].curr_location) -
                                this.GetCenterOffset(item)[1];
      }
    }

    this.stage.update();
  },

  /** Move items logic. */
  /** API. Move neutral items to corresponding locations. */
  MoveNeutralItems: function() {
    var current_player = ManagerGame.GetCurrentPlayer();
    Logger.Log('MoveNeutralItems: current player ' +
               JSON.stringify(current_player));
    var target = LayoutNoGridY - current_player.player_side - 1;
    Logger.Log('MoveNeutralItems: target ' + target);
    for (var k in ManagerSceneItem.curr_items) {
      var item_array = ManagerSceneItem.curr_items[k];
      for (var i = 0; i < item_array.length; ++i) {
        if (item_array[i].curr_location == LayoutSideNeutral) {
          Logger.Log('MoveNeutralItems: item' + k + ' ' + i);
          this.MoveItem(item_array[i], target);
        }
      }
    }

    this.stage.update();
  },

  /** API. Move items to target locations. */
  MoveItems: function(target_item_locations) {
    Logger.Log('MoveItems: ' + JSON.stringify(target_item_locations));
    if (target_item_locations == null) {
      Logger.Log('MoveItems error: target_item_locations are invalid');
      return;
    }

    for (var k in ManagerSceneItem.curr_items) {
      var item_array = ManagerSceneItem.curr_items[k];
      var target_locations = target_item_locations[k];
      if (item_array.length != target_locations.length) {
        Logger.Log('MoveItems warning: item lists size not same');
        continue;
      }

      for (var i = 0; i < item_array.length; ++i) {
        this.MoveItem(item_array[i], target_locations[i]);
      }
    }
  },

  /** API. Move one item to target location. */
  MoveItem: function(item, target) {
    if (target < 0 || target > (LayoutNoGridY - 1)) {
      Logger.Log(target + ' is not a valid location');
      return;
    }
    if (target == item.curr_location) {
      return;
    }

    // update location
    item.prev_location = item.curr_location;
    item.curr_location = target;

    // where to move to
    var current_y = item.render['icon'].y;
    var target_y = this.GetLocationY(item.curr_location) -
                   this.GetCenterOffset(item)[1];
    item.render['icon'].y = target_y;

    this.stage.update();
  },

  /** Component logic. */
  /** API. Set component effect. */
  SetComponentEffect: function(component, type, input_value, curr_value) {
    Logger.Log('SetComponentEffect input_value: ' + input_value +
               ' curr_value: ' + curr_value + ' type: ' + type);

    if (type == 'alpha') {
      component.alpha = input_value;
    }

    this.stage.update();
  },

  /** API. Enable in game component.
   * @param {boolean} type - enable or not.
   */
  EnableComponentInGame: function(flag) {
    Logger.Log('EnableComponentInGame: type is ' + type);
    if (flag) {
      this.SetComponentEffect(this.container_grid,
                              'alpha',
                              1,
                              this.container_grid.alpha);
    } else {
      this.SetComponentEffect(this.container_grid,
                              'alpha',
                              EffectDefaultTransparency,
                              this.container_grid.alpha);
    }
  },


  /** Helper functions. */
  /** API. Helper function that get location x of item.
   * @param {integer} x - which column.
   * @param {integer} which_item - which item.
   * @param {integer} num_items - total number of items.
   */
  GetLocationX: function(x, which_item, num_items) {
    var location_x = this.grid_width * (which_item + 1) / (num_items + 1) +
                     this.grid_width * x;
    return location_x;
  },

  /** API. Helper function that get location y of item.
   * @param {integer} y - which row.
   */
  GetLocationY: function(y) {
    return this.grid_height * (y + 0.5);
  },

  /** API. Helper function that get center offset of an item.
   * @param {Object} item - the item object.
   */
  GetCenterOffset: function(item) {
    var offset = [];
    offset.push(item.render['icon'].getChildAt(0).image.width * 0.5);
    offset.push(item.render['icon'].getChildAt(0).image.height * 0.5);
    return offset;
  },

  /** Timer logic. */
  /** Timer callback function. */
  Tick: function(evt) {
    ManagerScene.stage.update(evt);
    ManagerScene.HandleTimer(createjs.Ticker.getTime());
  },

  HandlerTickerGameStateMessage: function(seconds_gone, params) {
    if (params == null || params.length != 1) {
      return;
    }
    var display_message = params[0];
    var num_dots = seconds_gone % EffectNoDots;
    for (var i = 0; i < num_dots; ++i) {
      display_message += '.';
    }
    ViewGamePage.DisplayMessage('game-state', display_message);
  },

  /** Keyboard & mouse logic. */
  HandleKeyDown: function(e) {
    if (!e) {
      var e = window.event;
    }
  },

  MousedownIcon: function(evt, data) {
    var o = evt.target;
    data.offset = {x: o.x - evt.stageX, y: data.render['icon'].y - evt.stageY};
  },

  MouseOverIcon: function(evt, data) {
    var o = evt.target;
    o.cursor = 'pointer';
    data.offset = {x: o.x - evt.stageX, y: data.render['icon'].y - evt.stageY};
  },

  PressmoveIcon: function(evt, data) {
    // lost of binding
    var o = evt.target;
    o.cursor = 'pointer';
    data.render['icon'].y = evt.stageY + data.offset.y;
    if (data.render['icon'].y < 0) {
      data.render['icon'].y = 0;
    } else if (data.render['icon'].y > (ManagerScene.grid_height * LayoutNoGridY)) {
      data.render['icon'].y = ManagerScene.grid_height * LayoutNoGridY;
    }
  },

  ReleaseIcon: function(evt, data) {
    // lost of binding
    var o = evt.target;
    o.cursor = 'arrow';
    var location = Math.floor(data.render['icon'].y / ManagerScene.grid_height);
    if (location >= LayoutNoGridY) {
      location = LayoutNoGridY - 1;
    }
    if (data.curr_location != location) {
      data.curr_location = location;
    }
    data.render['icon'].y = ManagerScene.GetLocationY(location) -
                  ManagerScene.GetCenterOffset(data)[1];
    ViewGamePage.ShowDiv('#accept-div', false);
  },
};