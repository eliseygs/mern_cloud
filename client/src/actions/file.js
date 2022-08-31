import axios from 'axios'
import { hideLoader, showLoader } from '../reducers/appReducer'
import { addFile, deleteFileAction, setFiles, show } from '../reducers/fileReducer'
import { addUploadFile, changeUploadFile, showUploader } from '../reducers/uploadReducer'
import {API_URL} from '../config'
export function getFiles(dirId, sort){
    return async dispatch => {
        try {
            dispatch(showLoader())
            let url=`${API_URL}api/files`
            if(dirId){
                 url= url + `?parent=${dirId}`
            }
            if(sort){
                 url= url + `?sort=${sort}`
            }
            if(dirId && sort){
                 url= url + `?parent=${dirId}&sort=${sort}`
            }
            const response= await axios.get(url,
            {headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}})
            dispatch(setFiles(response.data))
        }catch(e){
            alert(e.response.data.message)
        }finally{
            dispatch(hideLoader())
        }
    }
}

export function createDir(dirId, name){
    return async dispatch => {
        try {
            const response= await axios.post(`${API_URL}api/files`,{
                name, parent:dirId,type:'dir'
            },
            {headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}})
            dispatch(addFile(response.data))
        }catch(e){
            alert(e.response.data.message)
        }
}
}
 export function postFile(file, dirId){
    return async dispatch => {
        try {
        const formData= new FormData()
        formData.append('file', file)
        if(dirId){
            formData.append('parent', dirId)
        }
            const uploadFile={name: file.name, progress: 0, id:Date.now()}
            dispatch(showUploader())
            dispatch(addUploadFile(uploadFile))
            const response= await axios.post(`${API_URL}api/files/upload`,formData,
            {headers:{Authorization:`Bearer ${localStorage.getItem('token')}`},
            onUploadProgress: progressEvent => {
                const totalLength= progressEvent.lengthComputable ? progressEvent.total:progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length') ;
                 console.log('total', totalLength)
                if(totalLength){
                    uploadFile.progress= Math.round((progressEvent.loaded * 100) / totalLength)    
                    dispatch(changeUploadFile(uploadFile))
                }
            }
            }
            )
            console.log('4llloogg')
            dispatch(addFile(response.data))
        }catch(e){
            console.log('lllllllllllll')
            alert(e.response.data.message)
        }
    }   
}
export async function downloadFile(file){

        console.log('b')
        const response= await fetch(`${API_URL}api/files/download?id=${file.id}`, {
        headers:{ authorization: `Bearer ${localStorage.getItem('token')}`}
    })
    if(response.ok === true){
        console.log('cccccccccccccccccccccccccccccccccccccccc')
        const blob= await response.blob()
        const downloadUrl= window.URL.createObjectURL(blob)
        const link= document.createElement("a")
        link.href=downloadUrl
        link.downldad= file.name
        document.body.appendChild(link)
        link.click()
        console.log('cccccccccccccccccccccccccccccccccccccccc')
        link.remove()
        console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww')
    }
}
export function deleteFile(file){
    return async dispatch => {
        try {
            const response= await axios.delete(`${API_URL}api/files?id=${file.id}`,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            await dispatch(deleteFileAction(file.id))
            alert(response.data.message)
        }catch(e){
            alert(e.response.data.message)
        }
    } 
}  
    
export function searchFiles(search){
    return async dispatch => {
        try {
            const response= await axios.get(`${API_URL}api/files/search?search=${search}`,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            await dispatch(setFiles(response.data))
        }catch(e){
            alert(e.response.data.message)
        }
    }   
}

