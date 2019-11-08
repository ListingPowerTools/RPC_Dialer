const router = require('express').Router()
const webRTC = require('./webRTC')
const twil = require('./telephony')

router.use('/webRTC', webRTC)
router.use('/telephony', twil)

router.get('/', (req, res) => {
  console.log('API Route')
  res.send('RPC Dialer API')
})

module.exports = router