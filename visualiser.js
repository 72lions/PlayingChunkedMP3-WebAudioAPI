/**
 * The visualiser class
 *
 * @constructor
 * @class Visualiser
 * @param {String} id The id of the canvas element.
 */
var Visualiser = function(id) {

  EventTarget.call(this);

  /**
   * The width of the canvas
   *
   * @private
   * @type {Number}
   */
  var CANVAS_WIDTH = 1024;

  /**
   * The height of the canvas
   *
   * @private
   * @type {Number}
   */
  var CANVAS_HEIGHT = 300;

  /**
   * The canvas dom element
   *
   * @private
   * @type {DOMElement}
   */
  var _canvas;

  /**
   * The context of the canvas element
   *
   * @private
   * @type {CanvasRenderingContext2D}
   */
  var _ctx;

  /**
   * The gradient
   *
   * @type {CanvasGradient}
   */
  var _gradient;

  /**
   * Draws on the canvas based on the data
   *
   * @param {Array} data An array containing all the data.
   * @return {Visualiser} Returns a reference to this instance.
   */
  this.draw = function(data) {
    _ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    _ctx.fillStyle = _gradient;
    for (var i = 0, len = data.length; i < len; i += 1) {
      var value = data[i];
      _ctx.fillRect(i * 3, CANVAS_HEIGHT - value, 1, CANVAS_HEIGHT);
    }

    return this;
  };

  /**
   * Initializes the class by loading the first chunk
   *
   * @return {Visualiser} Returns a reference to this instance.
   */
  this.init = function() {
    console.log('Visualiser initialized...');

    _canvas = document.getElementById(id);
    _canvas.width = CANVAS_WIDTH;
    _canvas.height = CANVAS_HEIGHT;
    _ctx = _canvas.getContext('2d');

    _gradient = _ctx.createLinearGradient(0, 0, 0, 300);

    _gradient.addColorStop(1, '#ff0000');
    _gradient.addColorStop(0.75, '#ff0000');
    _gradient.addColorStop(0.25, '#ff0000');
    _gradient.addColorStop(0, '#f3f3f3');

    return this;
  };
};
