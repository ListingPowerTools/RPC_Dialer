import React from 'react'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { connect } from 'react-redux'
import { saveWorker, saveReservation, acceptTask } from '../../../../../store/actions/dialpadActions'

import './styles.scss'

class AcceptTaskButton extends React.Component {
  acceptTask(task) {
      console.log('Accepting task: ', task)
      console.log('the websocket: ', this.props.dialpad.ws)

      //will end up modifying acceptTask to use different state for
      //server side verification first
      
      this.acceptTaskMessage(task)
  }

  acceptTaskMessage(task) {
    console.log('sending task to backend: ', task)
    console.log('the socket: ', this.props.socket)
    const message = { worker: this.props.dialpad.worker, message: task }
    console.log('the message: ', message)

    this.props.socket.send(JSON.stringify(message))
  }

  render() {
    return (
      <div className='accept-task-button'>
        <CheckCircleIcon onClick={e => {
          this.acceptTask(this.props.reservation)
        }}/>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  dialpad: state.dialpad
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  acceptTask: (task) => dispatch(acceptTask(task))
})

export default connect(mapStateToProps, mapDispatchToProps)(AcceptTaskButton)
