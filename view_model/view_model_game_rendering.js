/**
 * This module deals rendering part of the game.
 */
var ModuleGameRendering = {
	stage : null,
	container_grid : null,
	container_status : null,
	container_popup : null,
	label_turn : null,
	label_popup : null,

	canvas_default_width : -1,
	canvas_default_height : -1,
	grid_width : -1,
	grid_height : -1,

	timer_start : -1,
	timer_duration : -1,
	timer_prev_seconds : -1,
	timer_callback : null,
	timer_callback_params : null,

	SetupScene : function () {
		// setup scene
		var canvas = document.getElementById('gameCanvas');
		this.stage = new createjs.Stage(canvas);

		// setup canvas
		canvas_default_width = this.stage.canvas.width;
		canvas_default_height = this.stage.canvas.height;
		$(window).resize(this.UpdateCanvas);

		// easeljs setting
		createjs.Touch.enable(this.stage);
		this.stage.enableMouseOver(10);
		this.stage.mouseMoveOutside = true;
		document.onkeydown = this.HandleKeyDown;

		// background
		var img_bg = new createjs.Bitmap(ImageBackground);
		this.stage.addChild(img_bg);
		var label_side_you = new createjs.Text('Area: You', '40px Arial', '#000000'); 
		label_side_you.x = 0.5 * canvas.width;
		label_side_you.y = canvas.height - 20;
		label_side_you.textBaseline = 'bottom';
		label_side_you.textAlign = 'center';
		label_side_you.alpha = 0.2;
		var label_side_opponent = new createjs.Text('Area: Opponent', '40px Arial', '#000000'); 
		label_side_opponent.x = 0.5 * canvas.width;
		label_side_opponent.y = LayoutStatusBarY + 20;
		label_side_opponent.textBaseline = 'top';
		label_side_opponent.textAlign = 'center';
		label_side_opponent.alpha = 0.2;
		var label_side_neutral = new createjs.Text('Area: Neutral', '40px Arial', '#000000'); 
		label_side_neutral.x = 0.5 * canvas.width;
		label_side_neutral.y = (label_side_you.y + label_side_opponent.y) * 0.5 + 20;
		label_side_neutral.textBaseline = 'bottom';
		label_side_neutral.textAlign = 'center';
		label_side_neutral.alpha = 0.2;
		this.stage.addChild(label_side_you);
		this.stage.addChild(label_side_opponent);
		this.stage.addChild(label_side_neutral);
		stage_hit_area = new createjs.Shape();
		stage_hit_area.graphics.beginFill('#FFF').drawRect(0, 0, canvas.width, canvas.height);
		stage_hit_area.alpha = 0.01;
		this.stage.addChild(stage_hit_area);

	 	// main play ground container
	 	container_grid = new createjs.Container();
	 	container_grid.width = canvas.width;
	 	container_grid.height = canvas.height - LayoutStatusBarY;
	 	container_grid.x = 0;
	 	container_grid.y = LayoutStatusBarY;
	 	this.stage.addChild(container_grid);

	 	// status container
	 	container_status = new createjs.Container();
	 	container_status.width = canvas.width;
	 	container_status.height = LayoutStatusBarY;
	 	this.stage.addChild(container_status);

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
	 	this.stage.addChild(container_popup);

		// simulation loop
		createjs.Ticker.setFPS(SimulationFPS);
		createjs.Ticker.addEventListener('tick', this.Tick);
	},

	// type - 0: item1 1: item2 2: item3; transparent - 1: no , 0: yes
	SetupItem : function (temp_item) {
		temp_item.icon = new createjs.Container();
		var temp_img = new createjs.Bitmap(ImageItems[temp_item.category]);
		var hit_area = new createjs.Shape();
		temp_img.image.onload = function() {
			temp_item.icon.x -= 0.5 * temp_img.image.width;
			temp_item.icon.y -= 0.5 * temp_img.image.height;
			temp_item.icon.width = temp_img.image.width;
			temp_item.icon.height = temp_img.image.height;
			hit_area.graphics.beginFill('#FFF').drawRect(0, 0, temp_img.image.width, temp_img.image.height);
			hit_area.alpha = 0.01;
		}

		temp_item.icon.addChild(temp_img);
		temp_item.icon.addChild(hit_area);
		container_grid.addChild(temp_item.icon);
		hit_area.on('mousedown', this.MousedownIcon, null, false, temp_item);
		hit_area.on('mouseover', this.MouseOverIcon, null, false, temp_item);
		hit_area.on('pressup', this.ReleaseIcon, null, false, temp_item);
		hit_area.on('pressmove', this.PressmoveIcon, null, false, temp_item);

		this.stage.update();
	},

	UpdateCanvas : function () {
		var jCanvas = $('#gameCanvas');
		var jParent = $(jCanvas).parent();
		jCanvas.attr('width', $(jParent).width());

		var tw = $(jParent).width();
		var th = $(jParent).height();
		ModuleGameRendering.stage.scaleX = tw / canvas_default_width;
		ModuleGameRendering.stage.scaleY = ModuleGameRendering.stage.scaleX;
		jCanvas.attr('height', ModuleGameRendering.stage.scaleY * canvas_default_height);
	},

	UpdateGridSize : function () {
		grid_width = container_grid.width / LayoutNoGridX;
		grid_height = container_grid.height / LayoutNoGridY;
	},

	Redraw : function () {
		this.UpdateCanvas();
		this.UpdateGridSize();
		this.UpdateItemPositions();
		this.stage.update();
	},

	UpdateItemPositions : function () {
		for (var k in ModuleGameItems.curr_items) {
			var no_items = ModuleGameItems.curr_items[k].length;
			var item_array = ModuleGameItems.curr_items[k];
			for (var i = 0; i < no_items; i++)
			{
				var item = item_array[i];
				item.icon.x = ModuleGameRendering.GetLocationX(k, i, no_items) - ModuleGameRendering.GetCenterOffset(item)[0];
				item.icon.y = ModuleGameRendering.GetLocationY(item_array[i].curr_loc) - ModuleGameRendering.GetCenterOffset(item)[1];
			}
		}
		this.stage.update();
	},

	MoveItem : function (item, target) {
		if (target < 0 || target > 2) {
			ClientLog(target + ' is not a valid location');
			return;
		}
		if (target == item.curr_loc) return;
		item.prev_loc = target;
		item.curr_loc = target;
		var current_y = item.icon.y;		
		var target_y = this.GetLocationY(item.curr_loc) - this.GetCenterOffset(item)[1];
		var duration = EffectMoveSpeed * Math.abs(target_y - current_y) / this.grid_height;

		createjs.Tween.get(item.icon,{loop:false})
			.to({y: target_y}, duration)

		this.stage.update();
	},

	SetComponentEffect : function (comp, type, input_alpha, curr_alpha, duration) {
		if (curr_alpha != null) {
			if (curr_alpha == input_alpha)	return;
		}
		var dur = 50;
		if (duration != null)	dur = duration;
		if (type == 'alpha') {
			createjs.Tween.get(comp, {loop: false})
				.wait(dur)
				.to({alpha: input_alpha}, EffectDefaultTransition)
		}

		this.stage.update();
	},

	EnableCompInGame : function (type) {
		if (type == 'game') {
			this.SetComponentEffect(container_grid, 'alpha', 1, container_grid.alpha);
		}
		else if (type == 'none') {
			this.SetComponentEffect(container_grid, 'alpha', 0.5, container_grid.alpha);
		}

		this.stage.update();	
	},

	SetBackgroundLabel : function (index, label) {
		this.stage.getChildAt(index).text = label;
	},

	// render helper function
	GetLocationX : function(x, which_item, no_items) {
		return grid_width * (which_item + 1) / (no_items + 1) + grid_width * x;
	},

	// render helper function
	GetLocationY : function (y) {
		return grid_height * (y + 0.5);
	},

	// render helper function
	GetCenterOffset : function (item) {
		var loc = [];
		loc.push(item.icon.getChildAt(0).image.width * 0.5);
		loc.push(item.icon.getChildAt(0).image.height * 0.5);
		return loc;
	},

	Display : function (type, message) {
		if (this.game_finished)	return;
		if (type == 'game-state') {
			$("#game-state").text(message);
		}
		else if (type == 'game-message') {
			$("#game-message").text(message);
		}
	},

	// timer
	Tick : function (evt) {
		ModuleGameRendering.stage.update(evt);
		ModuleGameRendering.HandleTimer(createjs.Ticker.getTime());
	},

	StartTimer : function (duration, cb, params) {
		this.ResetTimer();
		this.timer_start = createjs.Ticker.getTime() / 1000;
		this.timer_duration = duration;
		this.timer_callback = cb;
		this.timer_callback_params = params;
	},

	ResetTimer : function () {
		this.timer_start = -1;
		this.timer_duration = -1;
		this.timer_callback = null;
		this.timer_prev_seconds = -1;
		this.timer_callback_params = null;
	},

	HandleTimer : function (t) {
		if (this.timer_start < 0)	return;
		var seconds_gone = Math.ceil((t - this.timer_start) / 1000.0);
		this.timer_callback(seconds_gone, this.timer_callback_params);
	},

	// handlers
	HandlerCountDown : function (seconds_gone, params) {
		if (seconds_gone > timer_duration) {
			ResetTimer();
			// ModuleGame.FlowStartGame();
		}
		if (timer_prev_seconds < 0)	{
			timer_prev_seconds = seconds_gone;
		}
		else {
			if (timer_prev_seconds != seconds_gone) {
				timer_prev_seconds = seconds_gone;
				var display_message = 'Game start in ' + seconds_gone + ' Seconds';
				this.Display('game-state', display_message);
			}
		}
	},

	HandlerLabelAnimation : function (seconds_gone, params) {
		if (params == null || params.length == 0) {
			ClientLog('HandlerLabelAnimation callback params is empty');
			return;
		}

		if (this.timer_duration > 0 && seconds_gone > this.timer_duration) {
			ResetTimer();
		}
		if (this.timer_prev_seconds < 0)	{
			this.timer_prev_seconds = seconds_gone;
		}
		else {
			if (this.timer_prev_seconds != seconds_gone) {
				this.timer_prev_seconds = seconds_gone;
				var display_message = params[0];
				var no_dots = seconds_gone % EffectNoDots;
				for (var i = 0; i < no_dots; i++)
					display_message += '.';
				this.Display('game-state', display_message);
			}
		}
	},

	HandleKeyDown : function (e) {
		if (!e) {var e = window.event;}
	},

	MousedownIcon : function (evt, data) {
		var o = evt.target;
		data.offset = {x: o.x - evt.stageX, y: data.icon.y - evt.stageY};
	},

	MouseOverIcon : function (evt, data) {
		var o = evt.target;
		o.cursor = 'pointer';
		data.offset = {x: o.x - evt.stageX, y: data.icon.y - evt.stageY};
	},

	PressmoveIcon : function(evt, data) {
		var o = evt.target;
		o.cursor = 'pointer';
		data.icon.y = evt.stageY + data.offset.y;
		if (data.icon.y < 0)
			data.icon.y = 0;
		else if (data.icon.y > (this.grid_height * LayoutNoGridY))
			data.icon.y = this.grid_height * LayoutNoGridY;
	},

	ReleaseIcon : function (evt, data) {
		var o = evt.target;
		o.cursor = 'arrow';
		var location = Math.floor(data.icon.y / grid_height);
		if (location >= LayoutNoGridY) location = LayoutNoGridY - 1;
		if (data.curr_loc != location) {
			data.curr_loc = location;
			ModuleGameController.ShowDiv('#acceptdiv', false);
		}
		data.icon.y = ModuleGameRendering.GetLocationY(location) - ModuleGameRendering.GetCenterOffset(data)[1];
	},
};