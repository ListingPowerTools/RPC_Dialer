import React from 'react'
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import './styles.scss'

class MuteButton extends React.Component {
  render() {
    return (
      <div className='mute-button'>
        <MicIcon />
      </div>
    )
  }
}

export default MuteButton