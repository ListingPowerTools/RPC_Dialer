const twilio = require('twilio')
const _ = require('lodash')
const VoiceResponse = twilio.twiml.VoiceResponse
const { ACCOUNT_SID, AUTH_TOKEN, TWILIO_NUMBER, WORKFLOW, CLONE_WORKFLOW, ENDPOINT } = require('../../config')
const client = twilio(ACCOUNT_SID, AUTH_TOKEN)

class TaskQueue {
  constructor(payload) {
    //may need to attach the queue resource data here
    this.workers = {}
    this.voice_channel_reservationLimit = 10
    this.tasks = []
    this._client = client

    this.set = this.set.bind(this)
    this.get = this.get.bind(this)
    this.emit = this.emit.bind(this)
    this.getAvailableWorkers = this.getAvailableWorkers.bind(this)
    this.fetchQueue = this.fetchQueue.bind(this)
    this.createQueue = this.createQueue.bind(this)
    this.deleteQueue = this.deleteQueue.bind(this)
  }

  set(payload) {
    console.log('setting payload: ', payload)
    this.workers[payload.workerSid] = payload
  }

  get(worker) {
    if (!worker) {
      return this.workers
    }
    return this.workers[worker]
  }

  emit(payload) {
    //only emit to the available workers
    const available_workers = this.getAvailableWorkers()
    console.log('EMITTING TO WORKERS: ', available_workers)

    Object.keys(available_workers).forEach(w => {
      console.log('emitting to worker: ', w)
      const worker = global._Clients.get(w)
      worker.send(JSON.stringify(payload))
    })

  }

  getAvailableWorkers() {
    let available = {}
    Object.keys(this.workers).forEach(w => {
      console.log('worker ', w)
      if (this.workers[w].reservations.length < this.voice_channel_reservation_limit) {
        available[w] = this.workers[w]
      }
    })
    return available
  }

  fetchQueue(friendlyName, callback) {
    return this._client.queues
      .list()
      .then(queues => {
        if (queues.length > 0) {
          console.log('queues: ', queues)
          const q = _.find(queues, function(q) {
            return q.friendlyName === friendlyName
          })
          console.log('Finding q: ', q)


          //Testing purposes
          if (q) {
            console.log('deleting queue: ', q)
            this.deleteQueue(q.sid)
              .then(res => console.log(res))
          }

          return callback(q)
        }
        return callback(null)
      })
      .catch(err => callback(null))
  }

  createQueue(friendlyName, callback) {
    return this._client.queues.create({ friendlyName: friendlyName })
      .then(queue => {
        console.log('THE CREATED QUEUE: ', queue)
        callback(queue)
      })
      .catch(err => callback(null))
  }

  deleteQueue(queueSid) {
    return this._client.queues(queueSid).remove()
  }
}

module.exports = TaskQueue