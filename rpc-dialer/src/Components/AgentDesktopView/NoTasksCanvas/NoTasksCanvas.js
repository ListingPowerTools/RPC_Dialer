import React from 'react'
import './styles.scss'

class NoTasksCanvas extends React.Component {
  render() {
    return (
      <div className='no-tasks-canvas'>
        <div className='no-tasks-content'>
          <div className='status-border'>
            <h3>Status</h3>
          </div>
          <h1 className='center-text'>No Active Tasks</h1>
          <h4 className='center-text'>Change activity state to start receiving tasks</h4>
        </div>
      </div>
    )
  }
}

export default NoTasksCanvas