import React, { Component } from 'react'
import {Doughnut, Line} from 'react-chartjs-2'
import firebase from 'firebase'

import logo from './logo.svg'
import './App.css'

const config = {
  apiKey: 'AIzaSyAUE5v4GX4Ti4QZhNhRLY7rmB7F3co3Ju8',
  authDomain: 'vacathon.firebaseapp.com',
  databaseURL: 'https://vacathon.firebaseio.com',
  projectId: 'vacathon',
  storageBucket: 'vacathon.appspot.com',
  messagingSenderId: '525053490596'
}

firebase.initializeApp(config)

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      labels: [],
      datasets: [
        {
          label: 'My First dataset',
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
    }
  }

  componentWillMount () {
    // firebase.database().ref('/').on('value', (snap) => {
    //   // console.log('new data received',snap.val())
    //   let newState = this.state
    //   let dataArray = Object.values(snap.val()).map(val => val.value)
    //   let labels = []
    //   for (let i = 0; i < dataArray.length; i++) {
    //     labels.push(i)
    //   }

    //   newState.labels = labels
    //   newState.datasets[0].data = dataArray
    //   console.log(dataArray, newState)
    //   this.setState(newState)
    // })
  }

  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'> Vakeeper </h1>
        </header>
        <p className='App-intro'>
          To get started, wtf edit <code>src/App.js</code> and save to reload.
        </p>
        {/* <Line data={this.state} /> */}
      </div>
    )
  }
}

export default App
