import React from 'react'
import { connect } from 'react-redux'
import './styles.scss'

//import the active and inactive task components
import NoTasksCanvas from '../../NoTasksCanvas'
import CallCanvas from '../../CallCanvas'

class Panel1 extends React.Component {
  componentDidMount() {
    console.log('Panel1 MOUNTED: ', this.props.dialpad)
  }

  componentDidUpdate() {
    console.log('Panel1 Updated: ', this.props.dialpad)
  }

  isEmpty(obj) {
    console.log('PANEL 1 isEmpty() check: ', obj)
    return (Object.entries(obj).length === 0 && obj.constructor === Object)
  }

  renderPanel(reservations, activeCall, socket) {
    console.log('RESERVATIONs IN RENDER PANEL :', reservations)
    if (reservations.length == 0 && this.isEmpty(activeCall)) {
      return <NoTasksCanvas />
    }
    return <CallCanvas socket={socket}/>
  }

  render() {
    return (
      <div className='panel-one'>
        {this.renderPanel(this.props.dialpad.reservations, this.props.activeCall, this.props.socket)}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  dialpad: state.dialpad,
  activeCall: state.dialpad.activeCall
})

export default connect(mapStateToProps)(Panel1)