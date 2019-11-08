import React from 'react'
import { connect } from 'react-redux'

import AcceptTaskButton from './AcceptTaskButton'
import RejectTaskButton from './RejectTaskButton'
import HoldCallButton from './HoldCallButton'
import EndCallButton from './EndCallButton'
import PhoneInTalkIcon from '@material-ui/icons/PhoneInTalk'
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled'

import './styles.scss'

class TaskListItem extends React.Component {
  isEmpty(obj) {
    console.log('checking isEmpty: ', obj)
    return (Object.entries(obj).length === 0 && obj.constructor === Object)
  }

  matches(reservation, activeCall) {
    const _reservation = reservation.sourceObject.data.CallSid
    if (_reservation === activeCall.CallSid) {
      return true
    }
    return false
  }

  renderButtons(reservation, activeCall) {
    console.log('reservation in render buttons: ', reservation)
    //will have to work on this later
    if (!this.isEmpty(activeCall) && this.matches(this.props.reservation, activeCall)) {
      return (
        <div className="task-buttons">
          <EndCallButton />
          <HoldCallButton />
        </div>
      )
    }
    return (
      <div className="task-buttons">
        <RejectTaskButton />
        <AcceptTaskButton socket={this.props.socket} reservation={reservation}/>
      </div>
    )
  }
  
  render() {
    return (
      <div className='task-list-item'>
        <div className="phone-icon-container">
          <PhoneInTalkIcon />
        </div>

        <div className="call-details">
          <div className="incoming-call-number">{this.props.reservation.sourceObject.data.Caller}</div>
          <div className="text">Incoming call</div>
        </div>

        {this.renderButtons(this.props.reservation, this.props.activeCall)}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  activeCall: state.dialpad.activeCall
})

export default connect(mapStateToProps)(TaskListItem)