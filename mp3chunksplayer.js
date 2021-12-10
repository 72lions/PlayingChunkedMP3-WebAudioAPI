/**
 * The MP3ChunksPlayer class
 *
 * @constructor
 * @class MP3ChunksPlayer
 */
var MP3ChunksPlayer = function() {

  EventTarget.call(this);

  /**
   * A reference to this specific instance.
   *
   *@private
   * @type {MP3ChunksPlayer}
   */
  var _self = this;

  /**
   * The ArrayBuffer that will have the new chunks appended
   *
   * @private
   * @type {ArrayBuffer}
   */
  var _activeBuffer;

  /**
   * The counter that holds the how many chunks we have loaded
   *
   * @private
   * @type {Number}
   */
  var _totalChunksLoaded = 0;

  /**
   * An array with all the individual files
   * @private
   * @type {Array}
   */
  var _files = [
    'xa',
    'xb',
    'xc',
    'xd',
    'xe',
    'xf',
    'xg',
    'xh',
    'xi',
    'xj',
    'xk',
    'xl',
    'xm',
    'xn',
    'xo',
    'xp',
    'xq',
    'xr',
    'xs',
    'xt',
    'xu',
    'xv',
    'xw',
    'xx',
    'xy'];

  /**
   * The AudioContext
   *
   * @private
   * @type {AudioContext}
   */
  var _context;

  /**
   * The audio buffer
   *
   * @private
   * @type {AudioBuffer}
   */
  var _audioBuffer;

  /**
   * The audio source is responsible for playing the music
   *
   * @private
   * @type {AudioBufferSourceNode}
   */
  var _audioSource;

  /**
   * The analyser
   *
   * @private
   * @type {AnalyserNode}
   */
  var _analyser;

  /**
   * It is responsible for loading all the different chunks
   *
   * @private
   * @type {XMLHttpRequest}
   */
  var _request = new XMLHttpRequest();

  /**
   * Creates a new Uint8Array based on two different ArrayBuffers
   *
   * @private
   * @param {ArrayBuffers} buffer1 The first buffer.
   * @param {ArrayBuffers} buffer2 The second buffer.
   * @return {ArrayBuffers} The new ArrayBuffer created out of the two.
   */
  var _appendBuffer = function(buffer1, buffer2) {
    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    var buff1 = new Uint8Array(buffer1);
    var buff2 = new Uint8Array(buffer2);
    tmp.set(buff1, 0);
    tmp.set(buff2, buffer1.byteLength);
    return tmp.buffer;
  };

  /**
   * Instantiates all the WebAudio items
   *
   * @private
   */
  var _initializeWebAudio = function() {
    _context = new AudioContext();
    _analyser = _context.createAnalyser();
    _analyser.fftSize = 2048;
  };

  /**
   * Plays the music from the point that it currently is.
   *
   * @private
   */
  var _play = function() {
    // Adding a bit of  scheduling so that we won't have single digit milisecond overlaps.
    // Thanks to Chris Wilson for his suggestion.
    var scheduledTime = 0.015;

    try {
      _audioSource.stop(scheduledTime);
    } catch (e) {}

    _audioSource = _context.createBufferSource();
    _audioSource.buffer = _audioBuffer;
    _audioSource.connect(_analyser);
    _audioSource.connect(_context.destination);
    var currentTime = _context.currentTime + 0.010 || 0;
    _audioSource.start(scheduledTime - 0.005, currentTime, _audioBuffer.duration - currentTime);
    _audioSource.playbackRate.value = 1;
    _self.trigger('message', ['AudioBuffer is replaced!']);
  };

  /**
   * Is triggered when a new chunk is loaded and makes sure to add the
   * new chunk to a new ArrayBuffer.
   *
   * @private
   */
  var _onChunkLoaded = function() {
    console.log('Chunk loaded!');
    _self.trigger('message', ['Chunk loaded!']);
    if (_totalChunksLoaded === 0) {
      _initializeWebAudio();
      _activeBuffer = _request.response;
    } else {
      _self.trigger('message', ['Chunk is appended!']);
      _activeBuffer = _appendBuffer(_activeBuffer, _request.response);
    }

    // Use decodeAudioData so that we don't block the main thread.
    _context.decodeAudioData(_activeBuffer.slice(0), function(buf) {
      _self.trigger('message', ['AudioData decoded!']);
      _audioBuffer = buf;
      _play();
    });

    // If this is the first chunk then trigger play
    if (_totalChunksLoaded === 0) {
      _self.trigger('play');
    }

    _totalChunksLoaded++;
    if (_totalChunksLoaded < _files.length) {
      setTimeout(function() {
        _loadChunk(_totalChunksLoaded);
      }, 3000);
    }
  };

  /**
   * Loads a specific chunk based on an index in an array.
   *
   * @private
   * @param  {Number} index The index of the chunk in the files array.
   */
  var _loadChunk = function(index) {
    _self.trigger('message', ['Loading chunk', _files[index], '...']);
    _request.open('GET', 'chunks/' + _files[index], true);
    _request.send();
  };

  /**
   * It gets the visualisation data
   *
   * @return {Uint8Array} The array that holds the visualisation data.
   */
  this.getVisualisationData = function() {
    // get the average for the first channel
    var array = new Uint8Array(_analyser.frequencyBinCount);
    _analyser.getByteFrequencyData(array);

    return array;

  };

  /**
   * Initializes the class by loading the first chunk
   *
   * @return {MP3ChunksPlayer} Returns a reference to this instance.
   */
  this.init = function() {
    console.log('MP3ChunksPlayer initialized!');

    _request.responseType = 'arraybuffer';
    _request.addEventListener('load', _onChunkLoaded, false);

    _loadChunk(_totalChunksLoaded);

    return this;
  };
};
