import React, { Component } from 'react'

import '../css/materialize.css'
import '../css/style.css'
import store from '../helpers/store'
import _ from 'lodash'
import { Card, FloatingActionButton, FontIcon } from 'material-ui'
import { ReactMic } from 'react-mic';

import watson from '../helpers/watson'

var SpeechToText = require('watson-speech/speech-to-text');
const TOKEN = 'u%2BdhDSDZBwJDQRMxJo%2F5R8ovnZjqXjlIuMlNxPNS9C1pjNplhTwDeL%2BujnM5R06Gwvn7hoNl6KrePt56MTii8Kt77yfmhqdimAnJEmhHAVFBtKyMlAI%2FDlhlpNSIWag%2F%2FG4jVfSN3%2FKGdb%2FvO10O6FeFISmLNwxvRHjEyhyQ8eE2UuxaL9BL7ds9TjItSkgG9EcntbqwLJ25uUqtMCBmU6mbwsUlMWVfkTpozXF3kA7Ab1Psi%2BHPUBEe75d7oJThcw2gI3CGTIOY8sNwU4V%2FRyacKO2uUwv%2B7tj9%2BGVjrqJvQEERpnUZOBzWSpNu6p7nJZKUkIyrYFsRAivXzGOfNe52o9MkbiBfKQWH7ZXHgY3Rc0umcMZFHOj5UhdK01MHA4Ch72oUnhX4Cmiprh5QSKqWwceMGUZdDjsgQRC%2FV5Qr6cRG1ZPvvTZgLZkjWZXYzAirMT5VIYWDmFxNtnk%2BXtSXChccvyo9Mkt7ieXh55LWbhetmB7uG0PzZD4beOvfl%2BpXP2cnzgQE98nOta34CxOX76Px0Wlfz9z3cwaNuU6hX7VwMPTLF%2FsjCZh%2BqcZ2ApudvZe7tjlCXNZ7uLUy4UH8AuxzpcOSObj8QK9T27cSqc78lFw%2BxHRtOPeor7KLpvSBAtPgiXejIWe5sGvndQACEG1LA2TR6KXcbePhg1UxJAkxoFeUmyygMm2fBifidneAnPh0ji7krMx5qTxbcoaqYBTlPBIFCxZHM%2BsIlcAoW3hNfg5Z7Ey2zGJLMBdFh2dCT1bipWRA6f8bpnX7qs2jaqOe9gIwgyDNQiXS03QiJB38IlfTclDCUpvn4i46yMTQguYTQXfKoz4StyhXIIwsYlYe7%2BJXaq2QfggFH3N0xNdk%2BytbIx%2FgyRhPt21TX2dEed5E10iyhTrbbk1x3OvbBxM6kr0cV7ri%2BETKj4ePqcs6JMm1qVZ3W5e%2FtKsjvkzxzJnYldxA892qBn7cAh%2BaDqKK2eI4IlqKvfVpJR0%3D%'

const LIGHT_BLUE = '#9fd9f6'
const DARK_BLUE = '#0085fa'
const WINE = '#b60041'
const YELLOW = '#fbd200'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      recording : false
    }
  }

  componentWillMount () {

  }

  componentDidMount () {
  }


  startRecording = () => {
    this.setState({
      recording: true
    });
  }

  stopRecording = () => {
    this.setState({
      recording: false
    });
  }

  async onStop(recordedBlob) {
    // console.log('recordedBlob is: ', recordedBlob);
    // // let response = await watson.sendAudio(recordedBlob)
    // let stream = SpeechToText.recognizeFile({
    //   token : TOKEN,
    //   file : recordedBlob.blob,
    //   'content-type' : 'audio/webm;codecs=opus',
    //   model: "pt-BR_BroadbandModel"
    // })
    // stream.on('error', function (err) {
    //   console.log(err);
    // })

    // console.log(stream)
    // fetch('https://54.233.87.88/api/stt',{
    //   method : 'POST',
    //   `
    // })
    let res = await watson.sendAudio(recordedBlob.blob)
    console.log(res)
  }


  render () {
    return (
      <div className='root'>
        <div className='blue-top' />
        <Card zDepth={4} className='container frame' containerStyle={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          height: 100 + '%'
        }}>

          <div style={{display: 'flex',
            flex: 2,
            alignContent: 'center',
            justifyContent: 'center'}}
          >
            <span className='income'> Receita </span>
          </div>

          <div className='divider' />

          <div style={{ flex: 1, flexGrow: 1, display : 'flex' }}>
            <div style={{ display : 'flex', flex : 1, justifyContent : 'center', alignItems : 'center', borderRight : '1px #e0e0e0 solid'}}>
              <span style={{ display : 'flex'}}> Receita </span>                                           
            </div>
            <div style={{ display : 'flex', flex : 1, justifyContent : 'center', alignItems : 'center'}}>
              <span style={{ display : 'flex'}}> Receita </span>          
            </div>
          </div>

        </Card>

        <Card zDepth={3} className='container frame' containerStyle={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          height: 100 + '%',
          marginTop : 100
        }}>

          <div> There should be more content here </div>

        </Card>

        <ReactMic
          record={this.state.recording}
          className={this.state.recording ? "sound-wave" : "sound-wave hidden"}
          onStop={this.onStop}
          strokeColor="white"
          backgroundColor={DARK_BLUE}  
        />    

      <div style={{textAlign : 'center', width : '100%', position : 'absolute', bottom : 0}}>
          <FloatingActionButton 
            className='record-button center' 
            onTouchTap={(ev) => {
              this.setState({ recording: !this.state.recording })
            }} 
            >
            <FontIcon className="material-icons">mic</FontIcon>
          </FloatingActionButton>
      </div>
    </div>
    )
  }
}

export default App
