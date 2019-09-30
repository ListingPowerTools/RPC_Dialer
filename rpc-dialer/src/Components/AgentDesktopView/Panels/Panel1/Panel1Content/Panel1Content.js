import React, { Component } from 'react'
import './styles.scss'

const Status = () => {
  return (
    <div className="status-section">
      <div className="status">Status</div>
      <div className="blue-line"></div>
    </div>
  )
}

const ActivityState = () => {
  return (
    <div className="activity-state">
      <h4>default: no active tasks</h4>
      <p>Change activity state to start receiving tasks.</p>
    </div>
  )
}

//Going to need to have state
//Set up redux

export class Panel1Content extends React.Component {
  render() {
    return (
      <div className="panel-1-content">
        <Status />
        <ActivityState />
      </div>
    )
  }
}