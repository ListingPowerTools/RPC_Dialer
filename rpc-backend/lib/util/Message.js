//Import the TaskDescriptor object to ensure we are sending the proper data to the frontend
//This is a temp class and will be replaced

class Payload {
  constructor(event, task) {
    this.event = event
    this.data = {
      ConferenceSid: task.ConferenceSid,
      CallStatus: 'in-progress',
      Hold: false
    }
  }
}

function SendPayload(_Clients, request) {
  console.log('SEND PAYLOAD request: ', request)
  const worker = request.FriendlyName
  
  try {
    const client = _Clients.get(worker)
    const payload = new Payload("activeConferenceAdded", request)

    if (client) {
      console.log('Sending conference payload to client: ', payload)
      client.send(JSON.stringify(payload))
    } else {
      console.log('no client')
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = SendPayload