const _ = require('lodash')
const { parseTime } = require('../util/Tools')
const { TaskProperties } = require('./TaskProperties')

class TaskDescriptor {
    constructor(descriptor) {
        if (!_.isObject(descriptor)) {
            throw new TypeError('Failed to instantiate TaskDescriptor. <Descriptor>descriptor is required.')
        }

        // if (!TaskProperties.every(p => p in descriptor)) {
        //     throw new TypeError('Failed to instantiate TaskDescriptor. <Descriptor>descriptor does not contain all properties of a Task.');
        // }

        this.attributes = JSON.parse(descriptor.attributes)
        this.priority = descriptor.priority
        this.queueName = descriptor.queue_name
        this.queueSid = descriptor.queue_sid
        this.taskChannelUniqueName = descriptor.task_channel_unique_name
        this.taskChannelSid = descriptor.task_channel_sid
        this.timeout = descriptor.timeout
        this.workflowName = descriptor.workflow_name
        this.workflowSid = descriptor.workflow_sid
        this.incomingTransferDescriptor = null
        this.outgoingTransferDescriptor = null
    }
}

module.exports = TaskDescriptor