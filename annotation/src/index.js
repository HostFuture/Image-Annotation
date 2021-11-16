import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from './components/auth';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import './index.css';


const Router = () => {
  return <BrowserRouter basename='/'>
    <Routes>
      <Route exact path="*" element={<RouteManager />}/>
    </Routes>
  </BrowserRouter>
}

const RouteManager = () => {
  const [auth] = useAuth();
  return auth ? <Dashboard /> : <Login />
}

ReactDOM.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById('root')
);