import React from 'react'
import TaskListItem from './TaskListItem'
import { connect } from 'react-redux'
import { saveWorker, saveReservation } from '../../../../../store/actions/dialpadActions'
import './styles.scss'

class TaskListContainer extends React.Component {
  componentDidMount() {
    console.log('TASK LIST CONTAINER MOUNTED: ', this.props.dialpad)
  }
  render() {
    return (
      <div className='task-list-container'>
        <div className="task-list-container-title">All Tasks</div>
        { this.props.dialpad.reservations.map((r, i) => <TaskListItem key={i} socket={this.props.socket} reservation={r}/>) }
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

export default connect(mapStateToProps, mapDispatchToProps)(TaskListContainer)