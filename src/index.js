import 'core-js'
import React from 'react'
import 'react-app-polyfill/stable'
import ReactDOM from 'react-dom'
import Core from './core/Core'
import reportWebVitals from './reportWebVitals'
// import store from './store'

ReactDOM.render(
    <Core />,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
