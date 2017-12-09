import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { AppContainer } from 'react-hot-loader'

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
        document.getElementById('root')
    )
}

// registerServiceWorker()
render(App)

if (module.hot) {
  module.hot.accept('./App', () => { render(App) })
}
