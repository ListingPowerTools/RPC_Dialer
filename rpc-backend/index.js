const express = require('express')
const expressWs = require('express-ws')
const NodeCache = require('node-cache')
const Clients = require('./Clients')

global.cache = new NodeCache()
global._Clients = new Clients()

const bodyParser = require('body-parser')
const cors = require('cors')
const API = require('./api/index')
const PORT = 8080

const WSS = expressWs(express())
const app = WSS.app
const Task = require('./lib/Task/TempTask')
const Worker = require('./lib/Worker')
const db = require('./api/database')
const { ListedQueue, RPF_Queue } = require('./lib/TaskQueue')

const initQueues = require('./api/middleware/initQueues')

//Store all the connected clients into the cache
cache.set('clients', {})

app.use('/api', API);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

initQueues(status => {
  console.log('Init queue status: ', status)
  console.log('listed queue: ', global.ListedQueue.task_queue_sid)
  console.log('rpf queue ', global.RPF_Queue.task_queue_sid)
})


app.get('/', (req, res) => {
  res.send('RPC Dialer API')
})

//web socket event listeners

app.ws('/worker/:workerSid', function(ws, req) {
  ws.on('message', function(msg) {
    console.log('the socket message: ', msg)

    try {
      const parsedMsg = JSON.parse(msg)
      console.log('the payload: ', parsedMsg.message.sourceObject.data)
      const callSid = parsedMsg.message.sourceObject.data.CallSid
      const workerSid = parsedMsg.worker.sid
      const task = parsedMsg.message.sourceObject.data
      console.log(callSid)
      console.log('WORKERSID IN TASK ACCEPTED: ', workerSid)

      const payload = JSON.stringify({
        event: "taskAccepted",
        data: task,
        workerSid: workerSid
      })

      ws.send(payload)
    } catch (e) {
      console.log(e)
    }
    
  })
})

const aWss = WSS.getWss('/worker')

aWss.on('connection', (socket, request) => {
  //Init the workers here
  console.log('Initializing worker socket')
  console.log(request.params.workerSid)

  try {
    const client_name = request.params.workerSid
    //mock db request
    const dbRes = db[client_name]

    console.log('DB CLIENT RESPONSE: ', dbRes)

    //For now the worker object only contains basic data
    //This is basically a simple schema validator
    const worker = new Worker({
      workerSid: dbRes.workerSid,
      contact_uri: dbRes.contact_uri,
      firstName: dbRes.firstName,
      lastName: dbRes.lastName,
      number: dbRes.number,
      activityState: dbRes.activityState,
      reservations: dbRes.reservations,
    })

    console.log('worker instance: ', worker)

    _Clients.set(client_name, request.ws)

    //Later on check the worker object for the task queue it's subscribed to and then add them to that
    //queue. Skip for now...
  
    //this should replace the above general setting of a clients object, so we can be mor specific
    global.ListedQueue.set(worker)

    const client = _Clients.get(client_name)
    const payload = {
      event: "workerSocketConnected",
      data: worker
    }

    //Send the worker object to the client instance
    client.send(JSON.stringify(payload))

  } catch (e) {
    console.log(e)
  }
})

app.ws('/echo', (ws, req) => {
  ws.on('message', msg => {
    ws.send('echo || socket message: ', msg)

  })

  ws.on('close', () => {
    console.log('Web Socket closed')
  })
})

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`)
})

