/** Model (static, front end, timer) for front end timer management. */
var ManagerSceneTimer = {
  // timer variables
  timer_start: -1,
  timer_duration: -1,
  timer_prev_seconds: -1,
  timer_tick_callback: null,
  timer_tick_callback_params: null,
  timer_finish_callback: null,
  timer_finish_callback_params: null,

  /** API. Start callback function.
   * @param {double} duration - duration of the timer.
   * @param {Object} tick_cb - callback whenever timer tick.
   * @param {Object} tick_params - tick callback parameters.
   * @param {Object} finish_cb - callback whenever timer finishes.
   * @param {Object} finish_params - finish callback parameters.
   */
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
    // Logger.Log('StartTimer: second ' + this.timer_start + ' ' +
    //            this.timer_duration + ' ' + this.timer_tick_callback_params);
  },

  /** API. Reset timer. */
  ResetTimer: function() {
    this.timer_start = -1;
    this.timer_duration = -1;
    this.timer_prev_seconds = -1;
    this.timer_tick_callback = null;
    this.timer_tick_callback_params = null;
    this.timer_finish_callback = null;
    this.timer_finish_callback_params = null;
  },

  /** API. Timer handler.
   * tick cb is called once per second.
   * finish cb is called after duration is passed.
   */
  HandleTimer: function(t) {
    // lost of binding
    // check if timer has started
    if (ManagerSceneTimer.timer_start < 0) {
      return;
    }

    // compute number of seconds gone
    var time_gone = t / 1000.0 - ManagerSceneTimer.timer_start;
    var seconds_gone = Math.ceil(time_gone);

    // check whether duration has passed
    // the order of resetting timer and finish_cb is strictly like this
    // because finish_cb might have logic related to timer, putting it after
    // reset timer would cancel those logics
    if (ManagerSceneTimer.timer_duration > 0 &&
        time_gone > ManagerSceneTimer.timer_duration) {
      var finish_cb = null;
      var finish_params = null;
      if (ManagerSceneTimer.timer_finish_callback != null) {
        finish_cb = ManagerSceneTimer.timer_finish_callback;
        finish_params = ManagerSceneTimer.timer_finish_callback_params;
      }

      this.ResetTimer();

      if (finish_cb != null) {
        finish_cb(finish_params);
      }
    }

    // check if customized ticking should happen
    if (ManagerSceneTimer.timer_prev_seconds < 0) {
      ManagerSceneTimer.timer_prev_seconds = seconds_gone;
    } else if (ManagerSceneTimer.timer_prev_seconds != seconds_gone) {
      ManagerSceneTimer.timer_prev_seconds = seconds_gone;
      if (ManagerSceneTimer.timer_tick_callback != null) {
        ManagerSceneTimer.timer_tick_callback(seconds_gone,
          ManagerSceneTimer.timer_tick_callback_params);
      } else {
        console.log('ticker_cb not found ???');
      }
    }
  },
};