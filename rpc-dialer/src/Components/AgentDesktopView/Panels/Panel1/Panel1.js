import React from 'react'
import  Panel1Content from './Panel1Content'
import './styles.scss'

class Panel1 extends React.Component {
  render() {
    return (
      <div className='panel-one'>
        <Panel1Content />
      </div>
    )
  }
}

export default Panel1