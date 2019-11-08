import React from 'react'
import TaskSection from './TaskSection'
import CallSection from './CallSection'
import { connect } from 'react-redux'

import './styles.scss'

class CallCanvasPanel extends React.Component {
  componentDidMount() {
    console.log('Call canvas component mounted: ', this.props.dialpad)
  }

  componentDidUpdate() {
    console.log('Call canvas component updated: ', this.props.activeCall)
  }

  isEmpty(obj) {
    console.log('checking isEmpty: ', obj)
    return (Object.entries(obj).length === 0 && obj.constructor === Object)
  }

  renderCallSection(activeCall) {
    if (this.isEmpty(activeCall)) {
      console.log('is empty is true || ', activeCall)
      return <div></div>
    }
    console.log('ACTIVE CALL IN RENDER CALL SECTION: ', activeCall)
    return <CallSection call={activeCall} />
  }

  render() {
    return (
      <div className='call-canvas-panel'>
        <TaskSection socket={this.props.socket}/>
        { this.renderCallSection(this.props.activeCall) }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  dialpad: state.dialpad,
  activeCall: state.dialpad.activeCall
})

export default connect(mapStateToProps)(CallCanvasPanel)