/**
 * Copyright reelyActive 2026
 * We believe in an open Internet of Things
 */


const Raddec = require('raddec');


/**
 * CassiaDecoder Class
 * Decodes data streams from one or more Cassia gateways and forwards the
 * packets to the given BarnowlCassia instance.
 */
class CassiaDecoder {

  /**
   * CassiaDecoder constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    options = options || {};

    this.barnowl = options.barnowl;
  }

  /**
   * Handle data from a given device, specified by the origin
   * @param {Buffer} data The data as a buffer or a JSON object.
   * @param {String} origin The unique origin identifier of the device.
   * @param {Number} time The time of the data capture.
   * @param {Object} decodingOptions The packet decoding options.
   */
  handleData(data, origin, time, decodingOptions) {
    let self = this;

    if(Array.isArray(data.bdaddrs) && Number.isInteger(data.rssi) &&
       Number.isInteger(data.chipId)) {
      let transmitterId = data.bdaddrs[0].bdaddr;
      let transmitterIdType = (data.bdaddrs[0].bdaddrType === 'public') ?
                                                Raddec.identifiers.TYPE_EUI48 :
                                                Raddec.identifiers.TYPE_RND48;

      let raddec = new Raddec({ transmitterId: transmitterId,
                                transmitterIdType: transmitterIdType,
                                timestamp: time });

      raddec.addDecoding({
          receiverId: data.chipId.toString(), // TODO: lookup MAC
          receiverIdType: Raddec.identifiers.TYPE_UNKNOWN,
          rssi: data.rssi
      });

      // TODO: reconstruct entire packet
      if(typeof data.adData === 'string') {
        raddec.addPacket(data.adData.toLowerCase());
      }
      if(typeof data.scanData === 'string') {
        raddec.addPacket(data.scanData.toLowerCase());
      }

      self.barnowl.handleRaddec(raddec);
    }
  }
}


module.exports = CassiaDecoder;
