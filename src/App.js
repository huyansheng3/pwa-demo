import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import axios from 'axios'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React 23222</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    )
  }

  componentDidMount() {
    const url = 'http://www.waka.life/api/v2/static_infos/countries_cities'
    axios.get(url).then(data => {
      console.log('componentDidMount', data)
    })
  }
}

export default App
