import React from 'react'
import { connect } from 'react-redux'
import { saveWorker, saveReservation } from '../../../store/actions/dialpadActions'
import './styles.scss'

class CrmContainer extends React.Component {
  render() {
    return (
      <div className='crm-container'>
        <div className='crm-content'>
          <div className='crm-config'>
            <h3>CRM CONFIG</h3>
          </div>
            {/* <button onClick={e => {
              console.log('CREATE RESERVATION || STATE: ', this.props.dialpad)
              this.props.saveReservation({
                reservationSid: 'sdf',
                taskSid: 'task sid'
              })
            }}>Create Reservation</button> */}
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(CrmContainer)