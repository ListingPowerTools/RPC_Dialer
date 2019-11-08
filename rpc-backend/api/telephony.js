const router = require('express').Router()
const taskrouter_token = require('./middleware/taskrouterToken')
const twilio = require('twilio')
const VoiceResponse = twilio.twiml.VoiceResponse
const bodyParser = require('body-parser')

const Task = require('../lib/Task/TempTask')
const { AUTH_TOKEN, ACCOUNT_SID, EVENT_CALLBACK_URL } = require('../config')
const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN)

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

//Start of Routes

router.get('/tr-token', taskrouter_token, (req, res) => {
  console.log('TASKROUTER TOKEN: ', req.taskrouter_token)
  
  res.set('worker-token', req.taskrouter_token)
  res.send({
    status: 200,
    message: 'Successful retrieval of TR token'
  })
})

module.exports = router