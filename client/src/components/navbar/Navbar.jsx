import  './navbar.less'
import React, { useState } from 'react';
import Logo from '../../assets/img/navbar-logo.svg'
import {NavLink} from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../reducers/userReducer';
import { getFiles, searchFiles } from '../../actions/file';
import avatarLogo from '../../assets/img/avatar.svg'
import {API_URL} from '../../config'
const Navbar = () => {
      const isAuth= useSelector(state => state.user.isAuth)
      const currentDir= useSelector(state=>state.file.currentDir)
      const currentUser= useSelector(state=>state.user.currentUser)
      const dispatch= useDispatch()
      const [searchName, setSearchName]= useState('')
      const [searchTimeout, setSearchTimeout]=useState(false)
      const avatar=currentUser.avatar ? `${API_URL + currentUser.avatar}` : avatarLogo

      function searchChangeHandler(e){
          setSearchName(e.target.value)
          if(searchTimeout !== false){
              clearTimeout(searchTimeout)
          }
          if(e.target.value !== ''){
              setSearchTimeout(setTimeout((value)=>{
                  dispatch(searchFiles(value))
              }, 500, e.target.value))
          }else{
            dispatch(getFiles(currentDir))
          }
      }
    return(
        <div className='navbar'>
            <div className='container'>
            <img src={Logo} alt="" className="navbar__logo"/>
            <div className='navbar__header'>MERN CLOUD</div>
            {!isAuth? 
                <div className='navbar__authorization '>
                <NavLink to='./login'>into</NavLink> 
                <NavLink to='./registration'>registration</NavLink>
                </div> 
                :
                <div>
                <input 
                value={searchName}
                onChange={e=> searchChangeHandler(e)}
                className="navbar__search"
                type="text"
                placeholder="name of files..."/>
                <NavLink to="/login" className='navbar__authorization' onClick={()=> dispatch(logOut())}>
                     exit
                </NavLink>
                <NavLink to='/profile'>
                    <img className="navbar__avatar" src={avatar} alt=""/>
                </NavLink>
                </div>
            }
            </div>
         </div>
    )
}

export default Navbar;