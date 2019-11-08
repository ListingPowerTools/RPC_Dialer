import React from 'react'
import axios from 'axios'
import CallEndIcon from '@material-ui/icons/CallEnd'
import { connect } from 'react-redux'
import { saveWorker, saveReservation, endCall } from '../../../../../../store/actions/dialpadActions'

import './styles.scss'

class EndCallButton extends React.Component {
  endConferenceCall(call) {
    console.log('ending call: ', call)
    console.log('the acceptedTask: ', this.props.dialpad.acceptedTask)
    // this.props.device.disconnect(conn => {
    //   this.props.device.destroy();
    //   this.props.endCall(call)
    // });

    const url = `https://d721cfeb.ngrok.io/api/webRTC/end-conference`
    return axios({
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      url: url,
      data: call
    })
    .then(res => {
      console.log('AXIOS: conference ended res from end call component: ', res)
      this.props.endCall({})
    })
    .catch(err => {
      console.log('error ending call: ', err)
    })
  }
  render() {
    return (
      <div className='end-call-button'>
        <CallEndIcon onClick={e => {
          this.endConferenceCall(this.props.dialpad.activeCall)
        }}/>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  dialpad: state.dialpad,
  device: state.dialpad.device,
  activeCall: state.dialpad.activeCall
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  saveWorker: (worker) => dispatch(saveWorker(worker)),
  saveReservation: (reservation) => dispatch(saveReservation(reservation)),
  endCall: (task) => dispatch(endCall(task))
})

export default connect(mapStateToProps, mapDispatchToProps)(EndCallButton)