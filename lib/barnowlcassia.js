/**
 * Copyright reelyActive 2026
 * We believe in an open Internet of Things
 */


const EventEmitter = require('events').EventEmitter;
const SseListener = require('./sselistener.js');
const TestListener = require('./testlistener.js');
const CassiaDecoder = require('./cassiadecoder.js');


/**
 * BarnowlCassia Class
 * Converts Cassia Networks gateway radio decodings into standard raddec events.
 */
class BarnowlCassia extends EventEmitter {

  /**
   * BarnowlCassia constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    super();
    options = options || {};
    options.barnowl = this;

    this.listeners = [];
    this.cassiaDecoder = new CassiaDecoder({ barnowl: this });
  }

  /**
   * Add a listener to the given hardware interface.
   * @param {Class} ListenerClass The (uninstantiated) listener class.
   * @param {Object} options The options as a JSON object.
   */
  addListener(ListenerClass, options) {
    options = options || {};
    options.decoder = this.cassiaDecoder;

    let listener = new ListenerClass(options);
    this.listeners.push(listener);
  }

  /**
   * Handle and emit the given raddec.
   * @param {Raddec} raddec The given Raddec instance.
   */
  handleRaddec(raddec) {
    // TODO: observe options to normalise raddec
    this.emit("raddec", raddec);
  }

  /**
   * Handle and emit the given infrastructure message.
   * @param {Object} message The given infrastructure message.
   */
  handleInfrastructureMessage(message) {
    this.emit("infrastructureMessage", message);
  }
}


module.exports = BarnowlCassia;
module.exports.SseListener = SseListener;
module.exports.TestListener = TestListener;
