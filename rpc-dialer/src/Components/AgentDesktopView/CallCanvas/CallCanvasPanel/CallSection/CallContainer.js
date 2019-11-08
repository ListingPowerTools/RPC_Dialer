import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { saveWorker, saveReservation, endCall, toggleHoldState } from '../../../../../store/actions/dialpadActions'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import { EndCallButton, MuteButton } from './CallButtons'
import CountUp from 'react-countup'

import './styles.scss'

class CallContainer extends React.Component {
  componentDidMount() {
    console.log('CALL CONTAINER ACTIVE CALL: ', this.props.activeCall)
    console.log('CALL CONTAINER CALL PROPS: ', this.props.call)
  }

  componentDidUpdate() {
    console.log('CALL CONTAINER COMPONENT DID UPDATE ACTIVE CALL: ', this.props.activeCall)
  }

  endConferenceCall(call) {
    console.log('ending call: ', call)
    console.log('THE ACTIVE CALL: ', this.props.activeCall)
    const url =  `https://d721cfeb.ngrok.io/api/webRTC/end-conference`
    let payload = Object.assign({}, call)
    payload.workerSid = this.props.dialpad.worker.sid

    console.log('THE PAYLOAD: ', payload)

    return axios({
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      url: url,
      data: payload
    })
    .then(res => {
      console.log('AXIOS: end conference CALL CONTAINER: ', res)
      this.props.endCall({})
    })
    .catch(err => {
      console.log('error ending call: ', err)
    })

  }

  toggleHold(call) {
    console.log('holding call: ', call)
    let hold = !call.Hold 

    const url =  `https://d721cfeb.ngrok.io/api/webRTC/hold-conference`
    return axios({
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      url: url,
      data: {
        call: call,
        hold: hold
      }
    })
    .then(res => {
      console.log('AXIOS: conference hold: ', res)
      this.props.toggleHoldState(hold)
    })
    .catch(err => {
      console.log('error ending call: ', err)
    })
  }

  render() {
    let renderHoldButton;
    let caller = this.props.activeCall.Caller;
    let callStatus = this.props.activeCall.Hold ? 'hold' : this.props.activeCall.CallStatus;

    if (this.props.activeCall.Hold) {
      renderHoldButton = (
        <PlayArrowIcon onClick={e => {
          this.toggleHold(this.props.activeCall)
        }}/>
      )
    } else {
       renderHoldButton = (
          <PauseCircleFilledIcon onClick={e => {
          this.toggleHold(this.props.activeCall)
        }}/>)
    }

    return (
      <div className='call-container'>
        <div className="call-top-section">
          <div className="top-left">
            <div className="number">{caller}</div>
            <div className="text-time"> {"Live"} | {Date.now()}</div>
          </div>
          <div className="top-right">
            <button onClick={e => {
              console.log('ending call')
              this.endConferenceCall(this.props.activeCall)
            }}>HANG UP</button>
          </div>
        </div>
        <div className="call-middle-section">
          <div className="call-status">{callStatus}</div>
          <div className="icon-section">
            <AccountCircleIcon />
            <div className="number">{caller}</div>
            <div className="text-time">{"Live"}</div>
            <div className="hold-button">
              { renderHoldButton }
            </div>
          </div>
        </div>
        <div className="call-buttons-section">
          <MuteButton />
          <EndCallButton />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  dialpad: state.dialpad,
  activeCall: state.dialpad.activeCall,
  device: state.dialpad.device
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  saveWorker: (worker) => dispatch(saveWorker(worker)),
  saveReservation: (reservation) => dispatch(saveReservation(reservation)),
  endCall: (task) => dispatch(endCall(task)),
  toggleHoldState: (hold) => dispatch(toggleHoldState(hold))
})

export default connect(mapStateToProps, mapDispatchToProps)(CallContainer)