import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { 
  saveWorker,
  saveToken,
  saveDevice,
  saveReservation,
  removeReservation,
  saveWebsocket,
  setActiveCall,
  setAcceptedTask,
  endCall,
  addConferenceSid
} from '../../store/actions/dialpadActions'
import Twilio from 'twilio-client/dist/twilio.min.js'
import RootContainer from './RootContainer'

// const URL = 'ws://localhost:8080/worker/Morty'

class Wrapper extends React.Component {
  state = {
    device: null,
    worker: null,
    task: null
  }

  componentDidMount() {
    //The client will be dervied from a database retrieval after the login
    const client = 'client:dcavanaugh2525';
    const clientTokenUrl = `https://mustard-coral-6194.twil.io/capability-token?client=${client}`;
    const URL = `${this.props.dialpad.ws_url}/${this.props.dialpad.worker.sid}`

    try {
      console.log('saving websocket')
      this.ws = new WebSocket(URL)
      this.props.saveWebsocket(this.ws)
    } catch(e) {
      console.log(e)
    }

    console.log('the state: ', this.props.dialpad);

    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected to socket from wrapper')
    }

    //Change to be more task/reservation oriented
    this.ws.onmessage = event => {
      console.log('SOCKET MESSAGE: ', event)
      const payload = JSON.parse(event.data)

      if (payload.event == 'taskCreated') {
        console.log('task created flow')
        console.log('RESERVATION: ', payload)

        this.props.saveReservation({
          taskSid: 'random taskSid',
          sourceObject: payload
        })
      }

      if (payload.event == 'taskAccepted') {
        const workerSid = payload.workerSid
        console.log('task accepted || calling', payload)
        console.log('workerSid: ', workerSid)

        this.props.setAcceptedTask(payload.data)
        const conn = this.props.device.connect({
          worker: workerSid,
          task: payload.data.CallSid
        })
      }

      if (payload.event == 'customerJoinedCall') {
        console.log('customer joined', payload)
        //now save the task as activecall in state using REDUX to show call screen
        this.props.setActiveCall(payload.data)
      }

      if (payload.event == 'conferenceStarted') {
        console.log('worker joined || adding conference sid', payload)
        //now save the task as activecall in state using REDUX to show call screen
        this.props.addConferenceSid(payload.data)
      }

      if (payload.event == 'activeConferenceAdded') {
        console.log('customer joined || adding conference sid', payload)
        //now save the task as activecall in state using REDUX to show call screen
        this.props.addConferenceSid(payload.data)
      }

      if (payload.event == 'workerEndedConference') {
        console.log('worker ended conference', payload)
        this.props.removeReservation(payload)
        // this.endConferenceCall(payload.data)
        this.props.endCall({})
      }


      if (payload.event == 'customerLeftCall') {
        console.log('CUSTOMER LEFT', payload)
        console.log('active call sid: ', this.props.activeCall)

        // this.props.removeReservation({
        //   data: {
        //     CallSid: this.props.activeCall.CallSid
        //   }
        // })

        // // this.props.removeReservation(payload)
        // this.endConferenceCall(this.props.activeCall)
        // this.props.endCall({})
      }
    }

    this.ws.onclose = () => {
      console.log('disconnected || reconnecting and saving websocket')
      // automatically try to reconnect on connection loss
      this.ws = new WebSocket(URL)
      this.props.saveWebsocket(URL)
    }

    if (!this.props.dialpad.token) {
      console.log('token is null, retrieving')

      fetch(clientTokenUrl, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'GET'
      })
      .then(res => res.json())
      .then(success => {
        console.log('twil client token: ', success)
        this.props.saveToken(success.token)
        this.initDialer(success.token)
      })
    } else {
      if (!this.props.device && this.props.dialpad.token) {
        this.initDialer(this.props.dialpad.token)
      }
    }
  }

  componentDidUpdate() {
    console.log('component updated: ', this.props.dialpad)

    if (this.state.worker) {
      console.log('the worker updated')
    }
  }

  initDialer(token) {
      this.state.device = new Twilio.Device();
      this.state.device.setup(token);
      this.state.device.on('ready', device => {
        console.log('Twilio.Device Ready!');
        this.props.saveDevice(device)
      });

      this.state.device.on('error', function (error) {
        console.log('Twilio.Device Error: ' + error.message);
      });

      this.state.device.on('connect', (conn) => {
        console.log('Successfully established call!');
        console.log(this.props.acceptedTask)
        const url = `https://d721cfeb.ngrok.io/api/webRTC/call-customer`
        return axios({
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          url: url,
          data: {
            customerCallSid: this.props.acceptedTask.CallSid,
            workerSid: this.props.dialpad.worker.sid
          }
        })
        .then(res => {
          console.log('AXIOS: after customer joined conference: ', res)
          console.log('SETTING ACTIVE CALL WITH ACCEPTED TASK: ', this.props.acceptedTask)
          this.props.setActiveCall(this.props.acceptedTask)
        })
        .catch(err => {
          console.log('error: ', err)
          this.props.setActiveCall({})
        })
      });

      this.state.device.on('disconnect', (conn) => {
        console.log('TWILIO DISCONNECT')

        this.props.removeReservation({
          data: {
            CallSid: this.props.activeCall.CallSid
          }
        })
        this.endConferenceCall(this.props.activeCall)
        this.props.endCall({})
        // conn.destroy()
      });

      this.state.device.on('incoming', function (conn) {
        console.log('Incoming connection: ', conn);
        conn.accept();
      });
  }

  endConferenceCall(call) {
    console.log('End conference call fn: ', call)
    const url =  `https://d721cfeb.ngrok.io/api/webRTC/end-conference`
    let payload = Object.assign({}, call)
    payload.workerSid = this.props.dialpad.worker.sid

    return axios({
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      url: url,
      data: payload
    })
    .then(res => {
      console.log('AXIOS: end call in wrapper: ', res)
      this.props.endCall({})
    })
    .catch(err => {
      console.log('error: ', err)
      this.props.endCall({})
    })
  }

  render() {
    return (
      <div>
        <RootContainer socket={this.ws}/>
      </div>
    )
  }

}

const mapStateToProps = (state, ownProps) => ({
  dialpad: state.dialpad,
  device: state.dialpad.device,
  activeCall: state.dialpad.activeCall,
  acceptedTask: state.dialpad.acceptedTask
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  saveWorker: (worker) => dispatch(saveWorker(worker)),
  saveDevice: (device) => dispatch(saveDevice(device)),
  saveToken: (token) => dispatch(saveToken(token)),
  setActiveCall: (activeCall) => dispatch(setActiveCall(activeCall)),
  setAcceptedTask: (acceptedTask) => dispatch(setAcceptedTask(acceptedTask)),
  endCall: (call) => dispatch(endCall(call)),
  saveReservation: (reservation) => dispatch(saveReservation(reservation)),
  removeReservation: (reservation) => dispatch(removeReservation(reservation)),
  addConferenceSid: (activeCall) => dispatch(addConferenceSid(activeCall)),
  saveWebsocket: (websocket) => dispatch(saveWebsocket(websocket))
})

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper)