const { ListedQueue, RPF_Queue } = require('../../lib/TaskQueue')
const _ = require('lodash')

function setQueueInstances() {
  try {
    global.ListedQueue = new ListedQueue()
    global.RPF_Queue = new RPF_Queue()    
  } catch (e) {
    throw e
  }
}

module.exports = (cb) => {
    setQueueInstances()
  
    Promise.all([
      global.ListedQueue.init(),
      global.RPF_Queue.init()
    ])
    .then(queues => {
      console.log('queues set || ', queues)
      const initCheck = _.every(queues, 'task_queue_sid')

      if (!initCheck) {
        return cb(false)
      }
      cb(true)
    })
    .catch(err => {
      console.log(err)
      cb(false)
    })
}