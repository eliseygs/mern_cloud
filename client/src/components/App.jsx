import React, { useEffect } from "react";
import Navbar from "./navbar/Navbar";
import './app.less';
import {BrowserRouter} from 'react-router-dom'
import { Route, Routes } from "react-router-dom";
import Authorization from "./authorization/Authorization";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../actions/user";
import Disk from "./disk/Disk";
import {Navigate} from "react-router-dom"
import Profile from "./profile/Profile";
function App() {
  const isAuth= useSelector(state => state.user.isAuth)
  const dispatch= useDispatch()
  useEffect(() =>{
    dispatch(auth())
  },[])
  
  return (
    <BrowserRouter>
    <div className="app">
      <h1> hekll</h1>
      <Navbar/>
      <div className="wrap"> 
        {!isAuth ? 
         <Routes>
            <Route
                    path='/registration' element={<Authorization/>}
            />
            <Route
                    path='/login' element={<Authorization/>}
            />
            <Route  path="*" element={<Navigate to= '/login'/>} />
        </Routes>
        :
         <Routes>
            <Route
                    path='/' element={<Disk/>}
            />
            <Route
                    path='/profile' element={<Profile/>}
            />
            <Route  path="*" element={<Navigate to= '/'/>} />
        </Routes>
      }
      </div>

    </div>
    </BrowserRouter> 
  );
}

export default App;
