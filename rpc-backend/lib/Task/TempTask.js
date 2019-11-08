const _ = require('lodash')
const TempTaskProperties = require('./TempTaskProperties')

class TempTask {
    constructor(descriptor) {
        console.log(TempTaskProperties)
        if (!_.isObject(descriptor)) {
            throw new TypeError('Failed to instantiate TaskAttributesDescriptor')
        }

        // TempTaskProperties.forEach(p => {
        //   if (!_.has(descriptor, p)) {
        //     throw new TypeError('Failed to instantiate TaskDescriptor. <Descriptor>descriptor does not contain all properties of a Task.');
        //   }
        // })

        this.CallSid = descriptor.CallSid
        this.Called = descriptor.Called
        this.CallerCountry = descriptor.CallerCountry
        this.Direction = descriptor.Direction
        this.CallerState = descriptor.CallerState
        this.To = descriptor.To
        this.CallerZip = descriptor.CallerZip
        this.CallStatus = descriptor.CallStatus
        this.From = descriptor.From
        this.CallerCity = descriptor.CallerCity
        this.Caller = descriptor.Caller
    }
}

module.exports = TempTask