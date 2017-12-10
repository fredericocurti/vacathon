import React, { Component } from 'react'

import '../css/materialize.css'
import '../css/style.css'
import store from '../helpers/store'
import _ from 'lodash'
import { Card, FloatingActionButton, FontIcon, CircularProgress, Snackbar, IconButton } from 'material-ui'
import { ReactMic } from 'react-mic';
import watson from '../helpers/watson'
import { white } from 'material-ui/styles/colors';

import Modal from './Modal'

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
      recording : false,
      waiting : false,
      snackbarVisible : false,
      snackbarMessage : '',
      modal : {
        open : true,
        data : {}
      }
    }
  }

  componentWillMount () {
    navigator.mediaDevices.getUserMedia({ audio: true })
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
    this.setState({ waiting: true   })
    let res = await watson.sendAudio(recordedBlob.blob)
    res = await res.json()
    console.log(res)
    this.setState({ waiting: false })
    if (res.intents == []){
      this.setState({snackbarMessage : 'Nenhuma ação foi detectada',snackbarVisible:true})
    } else {
      this.handleIntents(res)
    }
  }

  handleIntents = (res) => {
    if (res.intents != []){
      this.setState({...this.state, modal : { open : true, data : res }})
    }
  }


  render () {
    return (
      <div className='root'>
        <span className='app-logo'> Cowkeepy </span>
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
          marginTop : 50
        }}>

          <div style={{ display: 'flex', flexWrap: 'wrap', height: '100%' }}>
            <div className='action-buttons'>
              <FontIcon style={{display:'block'}}className='material-icons'>add_circle</FontIcon>
              <div style={{ marginTop: 5, color: 'gray' }}> Adicionar uma receita </div>
            </div>
            <div className='action-buttons'>
              <FontIcon style={{ display: 'block' }} className='material-icons'>remove_circle</FontIcon>
              <div style={{marginTop:5, color : 'gray'}}> Adicionar uma despesa </div></div>
            <div className='action-buttons'> eae </div>
            <div className='action-buttons'> ea </div>
          </div>

        </Card>

        <ReactMic
          record={this.state.recording}
          className={this.state.recording ? "sound-wave" : "sound-wave hidden"}
          onStop={this.onStop.bind(this)}
          strokeColor="white"
          backgroundColor={DARK_BLUE}  
        />    

      <div 
        className='record-button-wrapper' 
        style={{ textAlign : 'center', width : '100%', bottom : 0 }}>
          <FloatingActionButton 
            className={'record-button center'}
            backgroundColor={(this.state.recording ? 'lightgreen' : null || this.state.waiting ? 'gray' : null) || YELLOW } 
            onTouchTap={(ev) => {
              if (!this.state.waiting){
                this.setState({ recording: !this.state.recording })
              }
            }} 
          >
            {this.state.waiting ? <CircularProgress thickness={7} style={{marginTop:8}} color={white} width={56}/> : <FontIcon className="material-icons">mic</FontIcon> }
          </FloatingActionButton>
      </div>
    
    { this.state.modal.open ? <Modal open={this.state.modal.open} onClose={()=>{}} data={this.state.modal.data}/> : null }

    <Snackbar open={this.state.snackbarVisible} onRequestClose={()=>{this.setState({snackbarVisible : false})}} message={this.state.snackbarMessage} autoHideDuration={4000}></Snackbar>

    </div>
    )
  }
}

export default App
