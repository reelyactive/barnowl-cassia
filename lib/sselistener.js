/**
 * Copyright reelyActive 2026
 * We believe in an open Internet of Things
 */


const EventSource = require('eventsource');


const DEFAULT_BASE_URL = 'http://10.10.10.254';
const SCAN_ROUTE = '/gap/nodes?event=1';


/**
 * SseListener Class
 * Listens for Cassia data as Server-Sent Events.
 */
class SSEListener {

  /**
   * SseListener constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    options = options || {};

    this.decoder = options.decoder;
    this.baseUrl = options.baseUrl || DEFAULT_BASE_URL;

    createSseClient(this);
  }

}


/**
 * Create the SSE client and handle events.
 * @param {SseListener} instance The SseListener instance.
 */
function createSseClient(instance) {
  instance.sse = new EventSource(instance.baseUrl + SCAN_ROUTE);

  instance.sse.on('error', (error) => {
    console.log('barnowl-cassia: SSE error', error);
  });
  
  instance.sse.on('message', (message) => {
    try {
      instance.decoder.handleData(JSON.parse(message.data), instance.baseUrl,
                                  Date.now(), instance.decodingOptions);
    }
    catch(error) {}
  });
}


module.exports = SSEListener;
