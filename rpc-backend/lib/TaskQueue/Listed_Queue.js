const TaskQueue = require('./TaskQueue')

class ListedQueue extends TaskQueue {
  constructor(payload) {
    super(payload)
    this.task_queue_sid = null
    this.task_queue_friendly_name = 'Listed Queue'
    this.call_queue_max_size = null
    
    this.init = this.init.bind(this)
    this.setTaskQueue = this.setTaskQueue.bind(this)
    this.getTaskQueue = this.getTaskQueue.bind(this)
  }

  init() {
    console.log('taskqueue friendly name: ', this.task_queue_friendly_name)
    return this.getTaskQueue()
      .then(queue => {
        console.log('queue in init listed queue: ', queue)
        if (!queue) {
          console.log("queue doesn't exist, creating one")
          return this.createQueue(this.task_queue_friendly_name, _queue => {
            this.setTaskQueue(_queue)
            console.log('successful initialize of task queue: ', this.task_queue_sid)
          })
        }

        this.setTaskQueue(queue)
      })
      .then(() => this)
      .catch(err => {
        console.log('err in init task queue: ', err)
      })
  }

  setTaskQueue(queue) {
    console.log('setting the queue: ', queue)
    this.task_queue_sid = queue.sid
    this.call_queue_max_size = queue.maxSize
  }

  getTaskQueue() {
    return new Promise(resolve => {
      console.log(this.task_queue_friendly_name)
      this.fetchQueue(this.task_queue_friendly_name, resolve)
    })
  }

}

module.exports = ListedQueue