import React from 'react'
import axios from 'axios'
import CallEndIcon from '@material-ui/icons/CallEnd'
import { connect } from 'react-redux'
import { endCall } from '../../../../../store/actions/dialpadActions'

import './styles.scss'

class EndCallButton extends React.Component {
  endConferenceCall(call) {
    let payload = Object.assign({}, call)
    payload.workerSid = this.props.dialpad.worker.sid
    console.log('END CALL BUTTON COMPONENT || ending call: ', call)
    console.log('the acceptedTask: ', this.props.activeCall)
    console.log('the new payload: ', payload)

    //Using this below method may be nessary for other twilio
    //use cases, such as holding and switching between calls

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
      data: payload
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
      <div className='task-item-end-call-button'>
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
  endCall: (task) => dispatch(endCall(task))
})

export default connect(mapStateToProps, mapDispatchToProps)(EndCallButton)