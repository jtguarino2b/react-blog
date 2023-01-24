import React from 'react';
import {Route, Routes} from 'react-router-dom';
// import uuidv4 from 'uuid';

// Components
import Login from './components/Login'
import RegisterUser from './components/RegisterUser';
import BlogList from './components/BlogList';

// Styles
import './styles/app.scss';

function App() {


  return (
    <div className="main-wrapper">
      
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<RegisterUser />} />
        <Route path='/blog' element={<BlogList />} />
      </Routes>
    </div>
  );
}

export default App;
