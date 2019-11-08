import React from 'react'
import './styles.scss'

import CrmContainer from '../../CRMContainer'

class Panel2 extends React.Component {
  render() {
    let crmWindow;

    if (1 == 1) {
      crmWindow = <CrmContainer />
    }

    return (
      <div className='panel-two'>
        {crmWindow}
      </div>
    )
  }
}

export default Panel2