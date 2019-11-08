import React from 'react'
import axios from 'axios'
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled'
import { connect } from 'react-redux'
import { toggleHoldState } from '../../../../../store/actions/dialpadActions'

import './styles.scss'

class HoldCallButton extends React.Component {
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
    return (
      <div className='task-item-hold-call-button'>
        <PauseCircleFilledIcon onClick={e => {
          this.toggleHold(this.props.dialpad.activeCall)
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
  toggleHoldState: (hold) => dispatch(toggleHoldState(hold))
})

export default connect(mapStateToProps, mapDispatchToProps)(HoldCallButton)