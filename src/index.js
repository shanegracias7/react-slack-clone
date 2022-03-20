import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import reportWebVitals from './reportWebVitals';
import 'semantic-ui-css/semantic.min.css'

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

const Root = ()=>(
  <Router>
    <Routes>
      <Route  path='/' element ={<App/>}/>
      <Route  path='/login' element ={<Login/>}/>
      <Route  path='/register' element ={<Register/>}/>
    </Routes>
  </Router>
)
ReactDOM.render(
  <React.StrictMode>
    <Root/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
