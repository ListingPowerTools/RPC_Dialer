const _ = require('lodash')

class TaskAttributes {
    constructor(descriptor, added) {
        if (!_.isObject(descriptor) && !_.isObject(added)) {
            throw new TypeError('Failed to instantiate TaskAttributesDescriptor')
        }

        Object.keys(added).forEach(key => {
            this[key] = added[key]
        })

        this.callSid = descriptor.CallSid[0] || descriptor.CallSid[1] || descriptor.CallSid
        this.called = descriptor.Called
        this.digits = descriptor.Digits
        this.toState = descriptor.ToState
        this.callerCountry = descriptor.CallerCountry
        this.direction = descriptor.Direction
        this.callerState = descriptor.CallerState
        this.toZip = descriptor.ToZip
        this.to = descriptor.To
        this.callerZip = descriptor.CallerZip
        this.toCountry = descriptor.ToCountry
        this.finishedOnKey = descriptor.FinishedOnKey
        this.apiVersion = descriptor.ApiVersion
        this.calledZip = descriptor.CalledZip
        this.calledCity = descriptor.CalledCity
        this.callStatus = descriptor.CallStatus
        this.from = descriptor.From
        this.accountSid = descriptor.AccountSid
        this.calledCountry = descriptor.CalledCountry
        this.callerCity = descriptor.CallerCity
        this.caller = descriptor.Caller
        this.fromCountry = descriptor.FromCountry
        this.toCity = descriptor.ToCity
        this.fromCity = descriptor.FromCity
        this.calledState = descriptor.CalledState
        this.fromZip = descriptor.FromZip
        this.fromState = descriptor.FromState
    }
}

module.exports = TaskAttributes