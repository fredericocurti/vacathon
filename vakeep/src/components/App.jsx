import React, { Component } from 'react'

import '../css/materialize.css'
import '../css/style.css'
import store from '../helpers/store'
import _ from 'lodash'
import { Card, FloatingActionButton, FontIcon, CircularProgress, Snackbar, IconButton } from 'material-ui'
import { Doughnut, Line } from 'react-chartjs-2'
import { ReactMic } from 'react-mic';
import watson from '../helpers/watson'
import CountTo from 'react-count-to';
import { white } from 'material-ui/styles/colors';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import Modal from './Modal'
import firebase from 'firebase'
import moment from 'moment'
import {capitalize} from 'lodash'

let locale = require('moment/locale/pt-br');
moment.locale('pt-BR')

const fb = {
  apiKey: "AIzaSyAUE5v4GX4Ti4QZhNhRLY7rmB7F3co3Ju8",
  authDomain: "vacathon.firebaseapp.com",
  databaseURL: "https://vacathon.firebaseio.com",
  projectId: "vacathon",
  storageBucket: "vacathon.appspot.com",
  messagingSenderId: "525053490596"
};

var SpeechToText = require('watson-speech/speech-to-text');
const TOKEN = 'u%2BdhDSDZBwJDQRMxJo%2F5R8ovnZjqXjlIuMlNxPNS9C1pjNplhTwDeL%2BujnM5R06Gwvn7hoNl6KrePt56MTii8Kt77yfmhqdimAnJEmhHAVFBtKyMlAI%2FDlhlpNSIWag%2F%2FG4jVfSN3%2FKGdb%2FvO10O6FeFISmLNwxvRHjEyhyQ8eE2UuxaL9BL7ds9TjItSkgG9EcntbqwLJ25uUqtMCBmU6mbwsUlMWVfkTpozXF3kA7Ab1Psi%2BHPUBEe75d7oJThcw2gI3CGTIOY8sNwU4V%2FRyacKO2uUwv%2B7tj9%2BGVjrqJvQEERpnUZOBzWSpNu6p7nJZKUkIyrYFsRAivXzGOfNe52o9MkbiBfKQWH7ZXHgY3Rc0umcMZFHOj5UhdK01MHA4Ch72oUnhX4Cmiprh5QSKqWwceMGUZdDjsgQRC%2FV5Qr6cRG1ZPvvTZgLZkjWZXYzAirMT5VIYWDmFxNtnk%2BXtSXChccvyo9Mkt7ieXh55LWbhetmB7uG0PzZD4beOvfl%2BpXP2cnzgQE98nOta34CxOX76Px0Wlfz9z3cwaNuU6hX7VwMPTLF%2FsjCZh%2BqcZ2ApudvZe7tjlCXNZ7uLUy4UH8AuxzpcOSObj8QK9T27cSqc78lFw%2BxHRtOPeor7KLpvSBAtPgiXejIWe5sGvndQACEG1LA2TR6KXcbePhg1UxJAkxoFeUmyygMm2fBifidneAnPh0ji7krMx5qTxbcoaqYBTlPBIFCxZHM%2BsIlcAoW3hNfg5Z7Ey2zGJLMBdFh2dCT1bipWRA6f8bpnX7qs2jaqOe9gIwgyDNQiXS03QiJB38IlfTclDCUpvn4i46yMTQguYTQXfKoz4StyhXIIwsYlYe7%2BJXaq2QfggFH3N0xNdk%2BytbIx%2FgyRhPt21TX2dEed5E10iyhTrbbk1x3OvbBxM6kr0cV7ri%2BETKj4ePqcs6JMm1qVZ3W5e%2FtKsjvkzxzJnYldxA892qBn7cAh%2BaDqKK2eI4IlqKvfVpJR0%3D%'

const LIGHT_BLUE = '#9fd9f6'
const DARK_BLUE = '#0085fa'
const WINE = '#b60041'
const YELLOW = '#fbd200'

const initModal = {
  open: false,
  type: null,
  data: null 
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tableGeneralRows: [],
      recording : false,
      waiting : false,
      snackbarVisible : false,
      snackbarMessage : '',
      showGraph : false,
      showTable : false,
      lucro: '',
      receita: '',
      despesa: '',
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Leite',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: []
          }
        ]
      },
      modal : {
        open : false,
        type : null,
        data : null
      }
    }
  }

  componentWillMount () {
    firebase.initializeApp(fb)  
    navigator.mediaDevices.getUserMedia({ audio: true })
    this.getFinance()
    firebase.database().ref('/leite').on('value', (snap) => {
      let newState = this.state.chartData
      let dataArray = Object.values(snap.val()).map(val => val.volume)
      let dataArrayX = Object.values(snap.val()).map(val => moment(val.timestamp).format('HH:mm'))
      // let dataArray2 = Object.values(snap.val().leite).map(val => val.volume)
      // let dataArray2X = Object.values(snap.val().leite).map(val => moment(val.timestamp).calendar())
      let labels = []
      for (let i = 0; i < dataArray.length; i++) {
        labels.push(i)
      }

      newState.labels = dataArrayX
      newState.datasets[0].data = dataArray
      // newState.datasets[1].data = dataArray2
      console.log(dataArray, newState)
      this.setState({ chartData : newState })
    })
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
    if (res.intents.length == 0){
      this.setState({snackbarMessage : 'Nenhuma ação foi detectada',snackbarVisible:true})
    } else {
      this.handleIntents(res)
    }
  }

  handleIntents = (res) => {
    if (res.intents != []){
      this.setState({...this.state, modal : { open : true, data : res, type : res.intents[0].intent }})
    }
  }

  closeModal = () => {
    this.setState({ modal : initModal })
    this.getFinance()
  }

  getFinance(){
    fetch('/api/finances', {
        method: 'GET'
    })
    .then(res => res.json())
    .then(result => {
        console.log(result)
        let rows = []
        let custoHistory = result.custos;
        let receitaHistory = result.receitas;
        let custoTotal = result.custoTotal;
        let receitasTotal = result.receitasTotal

        console.log('============')
        console.log(typeof custoTotal)
        console.log(typeof receitasTotal)        
        let lucro = (parseInt(receitasTotal) - parseInt(custoTotal))
  
        this.setState({ lucro : lucro, receita : receitasTotal, despesa : custoTotal })
        console.log(custoHistory,receitaHistory)
        console.log(Object.keys(custoHistory).length)
        let k,v,x,y

        for ([k,v] of Object.entries(custoHistory)){
          rows.push(
          <TableRow key={k}>
            {/* <TableRowColumn style={{ color: "salmon" }}>Despesa</TableRowColumn>                       */}
            <TableRowColumn style={{color: "gray"}}>{ moment(v.hora).format('DD-MM-YYYY')}</TableRowColumn>
            <TableRowColumn style={{color: "gray"}}>{capitalize(v.natureza)}</TableRowColumn>
            <TableRowColumn style={{color: "gray"}}>{capitalize(v.valor)}</TableRowColumn>
            </TableRow>)
        }

        
        for ([x, y] of Object.entries(receitaHistory)) {
          rows.push(
            <TableRow key={x}>
              {/* <TableRowColumn style={{ color: "lightgreen" }}>Receita</TableRowColumn>             */}
              <TableRowColumn style={{ color: "gray" }}>{moment(y.hora).format('DD-MM-YYYY')}</TableRowColumn>
              <TableRowColumn style={{ color: "gray" }}>{capitalize(y.natureza)}</TableRowColumn>
              <TableRowColumn style={{ color: "gray" }}>{capitalize(y.valor)}</TableRowColumn>
            </TableRow>
          )
        }

      this.setState({ tableGeneralRows: rows })

      })        
  }

  render () {
    const chartconfig = {
      type: 'line',
      options: {
        responsive: true,
        title: {
          display: false,
          text: 'Chart.js Line Chart'
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Tempo'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Quantidade de leite produzida (Litros)'
            }
          }]
        }
      }
    }

    return (
      <div className='root'>
        <span className='app-logo'> CowApp </span>
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
            justifyContent: 'center',
            flexDirection:'column'}}
          >
            <span className='value' style={{ color : this.state.lucro >= 0 ? 'black' : 'darkred' }}> R$ {this.state.lucro} </span>          
            <span className='income'> Lucro </span>
          </div>

          <div className='divider' />

          <div style={{ flex: 1, flexGrow: 1, display : 'flex' }}>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', borderRight: '1px #e0e0e0 solid', flexDirection: 'column' }}>
              <span style={{ display: 'flex', color: 'lightgreen' }} className='value2'> R$ <CountTo to={this.state.receita} speed={500}/></span>                                                         
              <span style={{ display: 'flex' }} className='income2'> Receitas </span>                                           
            </div>
            <div style={{ display : 'flex', flex : 1, justifyContent : 'center', alignItems : 'center', flexDirection : 'column'}}>
              <span style={{ display: 'flex', color: WINE }} className='value2'> R$ <CountTo to={this.state.despesa} speed={500}/></span>          
              <span style={{ display: 'flex'}} className='income2'> Despesas </span>                        
            </div>
          </div>
        </Card>

        {this.state.showGraph 
        ? 
          <Card zDepth={3} className='container frame chart' containerStyle={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            height: 100 + '%',
            marginTop: 50
          }}>
            <Line width={300} data={this.state.chartData} options={chartconfig} />
        </Card>
        
       : null}

        {this.state.showTable ?
          <Card zDepth={3} className='container frame table' containerStyle={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            height: 100 + '%',
            marginTop: 50
          }}>

            <Table >
              <TableHeader adjustForCheckbox={false} displaySelectAll={false} style={{ backgroundColor: '#9FA8DA', color: 'white', }}>
                <TableRow >
                  {/* <TableHeaderColumn >Id da pergunta</TableHeaderColumn> */}
                  <TableHeaderColumn style={{ backgroundColor: DARK_BLUE, color: 'white', }}>Data</TableHeaderColumn>
                  <TableHeaderColumn style={{ backgroundColor: DARK_BLUE, color: 'white', }}>Natureza</TableHeaderColumn>
                  <TableHeaderColumn style={{ backgroundColor: DARK_BLUE, color: 'white', }}>Valor</TableHeaderColumn>
                </TableRow>
              </TableHeader>

              <TableBody displayRowCheckbox={false}>
                {this.state.tableGeneralRows}
              </TableBody>
            </Table>
          </Card>

          : null}
        
        <Card zDepth={3} className='container frame' containerStyle={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          height: 100 + '%',
          marginTop : 50,
          marginBottom: 100
        }}>

          <div style={{ display: 'flex', flexWrap: 'wrap', height: '100%' }}>
            <div className='action-buttons' onClick={() => {
              console.log('here')
              this.setState({ ...this.state, modal: { open: true, type: 'receita', data: null } })
            }}>
              <FontIcon 
              style={{display:'block'}} className='material-icons'>add_circle</FontIcon>
              <div style={{ marginTop: 5, color: 'gray' }}> Adicionar uma receita </div>
            </div>
            <div className='action-buttons' onClick={() => { this.setState({ ...this.state, modal: { open: true, type: 'despesa', data: null } }) }}              >
              <FontIcon 
                style={{ display: 'block' }} className='material-icons'>remove_circle</FontIcon>
              <div style={{marginTop:5, color : 'gray'}}> Adicionar uma despesa </div></div>
            <div className='action-buttons' onClick={() => { this.setState({ showTable: !this.state.showTable }) }}>
              <FontIcon
                style={{ display: 'block' }} className='material-icons'>assignment</FontIcon>
                <div style={{ marginTop: 5, color: 'gray' }}> Ver tabela </div>
            </div>
            <div className='action-buttons' onClick={() => { this.setState({ showGraph: !this.state.showGraph }) }}>
              <FontIcon
                style={{ display: 'block' }} className='material-icons'>show_chart</FontIcon>
              <div style={{ marginTop: 5, color: 'gray' }}> Ver gráficos </div>
            </div>
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
        style={{ textAlign : 'center', width : '100%', bottom : 0}}>
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
    
    { this.state.modal.open ? <Modal open={this.state.modal.open} type={this.state.modal.type} onClose={this.closeModal} data={this.state.modal.data}/> : null }

    <Snackbar open={this.state.snackbarVisible} onRequestClose={()=>{this.setState({snackbarVisible : false})}} message={this.state.snackbarMessage} autoHideDuration={4000}></Snackbar>

    </div>
    )
  }
}

export default App
