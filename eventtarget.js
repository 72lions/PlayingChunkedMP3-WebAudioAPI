/**
* Event target is used as a mixin so that the classes can
* support dispatch events and add events commands
*
* @class EventTarget
* @constructor
*
*/
var EventTarget = (function() {

  /**
  * The object that will hold all the event listeners
  *
  * @private
  * @type {Object}
  */
  this._listeners = {};

  /**
  * Registers an event
  *
  * @param {String} type The event type.
  * @param {Function} listener The callback function.
  * @param {Object} ctx The context.
  * @param {Number} priority The priority.
  */
  this.bind = function(type, listener, ctx, priority) {

    if (typeof priority === 'undefined') {
      priority = 0;
    }

    if (typeof listener !== 'undefined' && listener !== null) {

      var obj = {callback: listener, context: ctx, priority: priority};
      var exists = false;
      var events;

      if (this._listeners[type] === undefined) {
        this._listeners[type] = [];
      }

      events = this._listeners[type];

      for (var i = 0; i < events.length; i++) {

        if (events[i].callback === listener && events[i].context === ctx) {
          exists = true;
          break;
        }

      }

      if (exists === false) {
        this._listeners[type].push(obj);
        this._listeners[type].sort(_sortByPriorityDesc);
      }

    }

  };

  /**
   * Custom sorting function based on priority descending
   *
   * @private
   * @function
   * @param  {Object} a The first element to compare each priority.
   * @param  {Object} b The second element to compare each priority.
   * @return {Number} The result of the comparison.
   */
  var _sortByPriorityDesc = function(a, b) {
    return (b.priority - a.priority); //causes an array to be sorted numerically and ascending
  };

  /**
  * Dispatches an event
  *
  * @param {String} type The event type.
  * @param {Object} params The object.
  * @param {Object} extra Any extra arguments.
  */
  this.trigger = function(type, params, extra) {
    var events = this._listeners[type];
    params = params || {};
    if (typeof events !== 'undefined') {
      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        event.callback.call(event.context, {type: type, params: params, extra: extra || {}});
      }
    }

  };

  /**
  * Removes an event
  *
  * @param {String} type The event type.
  * @param {Function} listener The callback function.
  * @param {Object} ctx The context.
  *
  */
  this.unbind = function(type, listener, ctx) {
    var index = -1;
    var events = this._listeners[type];
    if (typeof listener !== 'undefined') {
      if (typeof events !== 'undefined') {
        for (var i = 0; i < events.length; i++) {
          if (events[i].callback === listener && events[i].context === ctx) {
            index = i;
            break;
          }
        }

        if (index !== - 1) {
          this._listeners[type].splice(index, 1);
        }
      }
    } else {
      this._listeners[type] = [];
    }
  };

});
