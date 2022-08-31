import React, { useState } from 'react';
import { useLocation} from 'react-router-dom';
import { registration, login } from '../../actions/user';
import Input from '../../utils/input/Input';
import {useDispatch} from 'react-redux'
import './authorization.less'
const Authorization = () => {
    const[email, setEmail]= useState("")
    const[password, setPassword]= useState("")
    const location = useLocation()
    const isLogin = location.pathname === '/login'
    const dispatch= useDispatch()
    
    return(
        <div className='authorization'>
            <div className='authorization__header'>
                {isLogin ?
                <div> 
                <h1> Authorization</h1>
                <Input value={email} setValue={setEmail} type="text" placeholder="Input email"/>
                <Input value={password} setValue={setPassword} type="password" placeholder="Input password"/>
                <button className='authorization__btn' onClick={()=>dispatch(login(email, password))}>into</button>
                </div>
                :
                <div>
                <h1> Registration</h1>
                <Input value={email} setValue={setEmail} type="text" placeholder="Input email"/>
                <Input value={password} setValue={setPassword} type="password" placeholder="Input password"/>
                <button className='authorization__btn' onClick={() => dispatch(registration(email, password))}>registration</button>
                </div>
                }
               

         </div>
        </div>
    )
}

export default Authorization;