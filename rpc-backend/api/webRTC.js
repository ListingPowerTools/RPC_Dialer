const router = require('express').Router()
const twilio = require('twilio')
const bodyParser = require('body-parser')
const cors = require('cors')

const VoiceResponse = twilio.twiml.VoiceResponse
const { ACCOUNT_SID, AUTH_TOKEN, TWILIO_NUMBER, WORKFLOW, CLONE_WORKFLOW, ENDPOINT } = require('../config')
const client = twilio(ACCOUNT_SID, AUTH_TOKEN)

//Library modules
const SendPayload = require('../lib/util/Message')
const Task = require('../lib/Task/TempTask')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))
router.use(cors())

router.post('/voice', (req, res) => {
  console.log('VOICE ROUTE')
  console.log(req.body)

  const response = new VoiceResponse()
  const call = req.body.CallSid
  const isWorker = ( req.body.Caller.indexOf('client')  > - 1 )

  function gather() {
    const getDigits = response.gather({ numDigits: 1 })
    getDigits.say('Press 1 for Listed. Press 2 for RP Funding')
    response.redirect('/voice')
  }

  //add call to cache store
  if (!cache.get(call) && !isWorker) {
    console.log('setting customer call')
    
    //the setting of the customer call will be replaced with a task object
    //the task object will then be added into the taskqueue objects tasks list
    
    // cache.set(call, JSON.stringify(req.body))
    // const payload = {
    //   event: "taskCreated",
    //   data: new Task(req.body)
    // }

    // console.log('THE PAYLOAD: ', payload)

    
    // global.ListedQueue.emit(payload)

    //the queue will be associated with the task queue object instance

    // response.enqueue({
    //   action: 'enqueue-callback',
    //   method: 'POST'
    // }, 'parking lot')

    if (req.body.Digits) {
      console.log('req digits: ', req.body.Digits)
      const input = req.body.Digits

      switch(input) {
        case 1:

          break;
        case 2:

          break;
        default:
          console.log('restart the gather')
          gather()
      }

    } else {
      gather()
    }

    res.set('Content-Type', 'text/xml')
    res.send(response.toString())

  } else {
    console.log('Incoming voice call is a worker client: ', req.body)
    
    const { worker, task } = req.body
    const dial = response.dial()
    console.log('the worker: ', worker)
    console.log('the customer: ', task)
    const callback = `inbound-join-handler?workerSid=${worker}&customerCallSid=${task}`

    //Before creating the agent conference, we're going to
    //have to update the call/task and stop emitting it to
    //the workers

    dial.conference({
      statusCallback: callback,
      statusCallbackEvent: 'start join end',
      endConferenceOnExit: true
    }, worker)

    res.set('Content-Type', 'text/xml')
    res.send(response.toString())
  }
})

router.post('/inbound-join-handler', (req, res) => {
  const response = new VoiceResponse()
  const worker = req.query.workerSid
  const customer = req.query.customerCallSid
  console.log(req.body.StatusCallbackEvent)
  console.log('Inbound Join Handler', req.body)
  console.log('QUERY PARAMS || Worker: ', worker)
  console.log('CUSTOMER: ', customer)

  //send the conferenceSid to the frontend.
  //later on, the task will be updated in the backend with the necessary conference details
  //and send to the frontend to manage the data

  if (req.body.StatusCallbackEvent == 'conference-start') {
    console.log('event is conference start')
    try {
      const client = global._Clients.get(worker)

      // const client = global.ListedQueue.get()

      const payload = {
        event: "conferenceStarted",
        data: {
          ConferenceSid: req.body.ConferenceSid
        }
      }
      
      if (client) {
        console.log('Sending conference payload to client: ', payload)
        client.send(JSON.stringify(payload))
      } else {
        console.log('no client')
      }
    } catch (e) {
      console.log(e)
    }

  } else if (req.body.StatusCallbackEvent == 'conference-end') {
    console.log('CONFERENCE END SENDING PAYLOAD')
    console.log('the customer: ', customer)
      try {
        const client = global._Clients.get(worker)

        // const client = global.ListedQueue.get()

        const payload = {
          event: "customerLeftCall"
        }

        console.log('the payload: ', payload)
        
        if (client) {
          console.log('Sending conference payload to client: ', payload)
          client.send(JSON.stringify(payload))
        } else {
          console.log('no client')
        }
      } catch (e) {
        console.log(e)
      }
  } else {
    console.log('not complete or end, sending payload')
    SendPayload(_Clients, req.body)
  }

  res.set('Content-Type', 'text/xml')
  res.send(response.toString())
})

router.post('/end-conference', (req, res) => {
  console.log('end conference route: ', req.body)
  const response = new VoiceResponse()
  const conferenceSid = req.body.ConferenceSid

  client.conferences(conferenceSid)
    .update({status: 'completed'})
    .then(conference => {
      
      console.log('the conference: ', conference)
      const worker = conference.friendlyName
      const workerClient = _Clients.get(worker)

      if (workerClient) {
        console.log('worker client')
        const payload = {
          event: "workerEndedConference",
          data: new Task(req.body)
        }

        workerClient.send(JSON.stringify(payload))
        res.set('Content-Type', 'text/xml')
        res.send(response.toString())
      } else {
        console.log('no client')
        //send an error message perhaps

        res.set('Content-Type', 'text/xml')
        res.send(response.toString())
      }
    })
    .catch(err => {
      console.log(err)
      res.set('Content-Type', 'text/xml')
      res.send(response.toString())
    })
})

router.post('/call-customer', (req, res) => {
  console.log('WORKER STATUS CB: ', req.body)
  const response = new VoiceResponse()
  const customer = req.body.customerCallSid;
  const worker = req.body.workerSid
  console.log('THE CUSTOMER CALLSID: ', customer)

  const url = `${ENDPOINT}/api/webRTC/task-inbound-join?workerSid=${worker}`
  
  client.calls(customer)
    .update({ url })
    .then(call => {
      console.log('The customer call: ', call)
      res.set('Content-Type', 'text/xml')
      res.send(response.toString())
    })
    .catch(err => {
      console.log(err)
      res.set('Content-Type', 'text/xml')
      res.send(response.toString())
    })

  //listen to start event and start the redirect of the enqueue'd call
})

router.post('/enqueue-callback', (req, res) => {
  console.log('ENQUEUE CALLBACK: ', req.body)
  const response = new VoiceResponse()
  const { CallSid } = req.body
  const call = cache.get(CallSid)

  if (call) {
    console.log('deleting call: ', call)
    cache.del(call)
  } else {
    console.log('invalid call')
  }

  res.set('Content-Type', 'text/xml')
  res.send(response.toString())
})

router.post('/task-inbound-join', (req, res) => {
  console.log('Task inbound join route: ', req.body)
  const response = new VoiceResponse()
  const dial = response.dial()
  const conference = req.query.workerSid

  console.log('ZE CONFERENCE ', conference)

  //For testing endConferenceOnExit will be set to true
  dial.conference({
    statusCallback: 'inbound-join-handler',
    statusCallbackEvent: 'join',
    endConferenceOnExit: true
  }, conference)

  //try sending the socket message here, just incase there is a 
  //parsing error or socket connection issue, we will want the customer
  //to join the call
  try {
    const client = _Clients.get(conference)
    const payload = {
      event: "customerJoinedCall",
      data: new Task(req.body)
    }

    if (client) {
      console.log('Client exists, sending to client')
      client.send(JSON.stringify(payload))
    } else {
      console.log('no client')
    }
  } catch (e) {
    console.log(e)
  }

  res.set('Content-Type', 'text/xml')
  res.send(response.toString())
})

router.post('/hold-conference', (req, res) => {
  console.log('hold-conference route: ', req.body)
  const response = new VoiceResponse()
  const callSid = req.body.call.CallSid
  const conferenceSid = req.body.call.ConferenceSid
  let hold = req.body.hold

  console.log(hold)

   client.conferences(conferenceSid)
    .participants(callSid)
    .update({
      hold: hold
    })
    .then(conference => {
      console.log('the conference: ', conference)

      res.set('Content-Type', 'text/xml')
      res.send(response.toString())
    })
    .catch(err => {
      console.log(err)
      res.set('Content-Type', 'text/xml')
      res.send(response.toString())
    })
})

module.exports = router