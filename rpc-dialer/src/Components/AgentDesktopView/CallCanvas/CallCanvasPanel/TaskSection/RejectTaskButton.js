import React from 'react'
import CancelIcon from '@material-ui/icons/Cancel';
import { connect } from 'react-redux'
import { saveWorker, saveReservation } from '../../../../../store/actions/dialpadActions'

import './styles.scss'

class RejectTaskButton extends React.Component {
  rejectTask() {
    console.log('Rejecting task')
  }
  render() {
    return (
      <div className='reject-task-button'>
        <CancelIcon onClick={this.rejectTask} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  dialpad: state.dialpad
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  saveWorker: (worker) => dispatch(saveWorker(worker)),
  saveReservation: (reservation) => dispatch(saveReservation(reservation))
})

export default connect(mapStateToProps, mapDispatchToProps)(RejectTaskButton)