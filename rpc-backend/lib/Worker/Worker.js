const descriptor = require('./WorkerDescriptor')
const _ = require('lodash')

class Worker {
  constructor(payload) {
    if (!_.isObject(descriptor)) {
        throw new TypeError('Failed to instantiate Worker. <Descriptor>descriptor is required.');
    }

    descriptor.forEach(d => {
      if (!_.has(payload, d)) {
        throw new TypeError('Failed to instantiate Worker. <Descriptor>descriptor does not contain all properties of a worker.');
      }
    })

    this.workerSid = payload.workerSid
    this.contact_uri = payload.contact_uri
    this.first_name = payload.firstName
    this.last_name = payload.lastName
    this.number = payload.number
    this.activity_state = payload.activityState
    this.reservations = payload.reservations
  }
}

module.exports = Worker