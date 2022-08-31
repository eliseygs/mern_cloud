import axios from 'axios'
import { setUser } from '../reducers/userReducer'
import {API_URL} from '../config'
export const registration=  (email, password) =>{
    return async dispatch => {
    try{
        const response= await axios.post(`${API_URL}api/auth/registration`,{
            email,
            password
        })
        console.log(response.data.user)
        dispatch(setUser(response.data.user))
        localStorage.setItem('token', response.data.token)
    } catch(e){
        alert(e.response.data.message)
    }
}
}



export const login=  (email, password) =>{
    return async dispatch => {
    try{
        const response= await axios.post(`${API_URL}api/auth/login`,{//if catch error 
            email,
            password
        })
        dispatch(setUser(response.data.user))
        localStorage.setItem('token', response.data.token)//dont work at catch that is res.status, but doesnot catch work with underfind user at he was underfind
        console.log(response.data.user)//too
        console.log(response.data.token)//too
    } catch(e){
        alert(e.response.data.message)//go here and dont create user=underfind 
    }
  }
}

export const auth=  () =>{
    return async dispatch => {
    try{
        console.log(localStorage.getItem('token'))
        const response= await axios.get(`${API_URL}api/auth`,

        {headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}})
        console.log(response.data.user)
        dispatch(setUser(response.data.user))
        console.log(response.data.token)
        localStorage.setItem('token', response.data.token)
    } catch(e){
        alert(e.response.data.message)//res.json(message)
        localStorage.removeItem('token')
    }
  }
}

export const postAvatar=  (file) =>{
    return async dispatch => {
    try{
        const formData= new FormData()
        formData.append('file',file)
        console.log(localStorage.getItem('token'))
        const response= await axios.post(`${API_URL}api/files/avatar`,formData,
        {headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}})
        dispatch(setUser(response.data))
    } catch(e){
        alert(e.response.data.message)//res.json(message)
    }
}
}

export const deleteAvatar=  () =>{
    return async dispatch => {
    try{
        const response= await axios.delete(`${API_URL}api/files/avatar`,
        {headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}})
        dispatch(setUser(response.data))
    } catch(e){
        alert(e.response.data.message)//res.json(message)
    }
}
}