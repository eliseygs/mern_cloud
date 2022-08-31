import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFiles } from "../../actions/file";
import './disk.less'
import FileList from "./fileList/FileList";
import { hide, setCurrentDir, setFileView, setPopupDisplay, show } from "../../reducers/fileReducer";
import {postFile} from '../../actions/file'
import Popup from "./Popup";
import Uploader from "./uploader/Uploader";

const Disk= ()=>{
    const dispatch= useDispatch()
    const currentDir= useSelector(state => state.file.currentDir)
    const loader= useSelector(state=>state.app.loader)
    const dirStack= useSelector(state => state.file.dirStack)
    const [dragEnter, setDragEnter]= useState(false)
    const [sort, setSort]= useState('type')
    useEffect(()=> {
        dispatch(getFiles(currentDir, sort))
    },[currentDir, sort])// change at backClickHandler
    
    function showPopupHandler(){
        //dispatch(createDir(currentDir, 'adsdfasfs'))
        dispatch(setPopupDisplay('flex'))
    }
    function backClickHandler(){
        const backDirId= dirStack.pop()
        dispatch(setCurrentDir(backDirId))
    }
    function filePostHandler(event){
        const files=[...event.target.files]//MASSIVE GET FILES
        files.forEach(file => dispatch(postFile(file, currentDir)))
    }
    function dragEnterHandler(event){
        event.preventDefault()
        event.stopPropagation()
        setDragEnter(true)
    }
    function dragLeaveHandler(event){
        event.preventDefault()
        event.stopPropagation()
        setDragEnter(false)
    }
    function dropHandler(event){
        event.preventDefault()
        event.stopPropagation()
        setDragEnter(false)
        let files= [...event.dataTransfer.files]
        files.forEach(file => dispatch(postFile(file, currentDir)))
        setDragEnter(false)
    }    
    if(loader===true){
        return(
            <div className="loader">
                <div className="lds-dual-ring"></div>
            </div>
        )
    }
    return( !dragEnter ?
            <div className="disk" onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
                <div className="disk__btns">
                    <button className="disk__back" onClick={()=> backClickHandler()}>Back</button>
                    <button className="disk__create" onClick={()=> showPopupHandler()}>Create dir</button>
                    <div className="disk__upload">
                        <label htmlFor="disk__upload-input" className='disk__upload-label'>upload file</label>
                        <input multiple={true} onChange={(event)=> filePostHandler(event)} type="file" id="disk__upload-input" className="disk__upload-input"/>
                    </div>
                    <select value={sort} onChange={(e)=>{setSort(e.target.value)}} className="disk__select" >
                        <option value="name">on name</option>
                        <option value="type">pn type</option>
                        <option value="date">on date</option>
                    </select>
                    <button className="disk__plate"onClick={()=> dispatch(setFileView('plate'))}/>
                    <button className="disk__list"onClick={()=> dispatch(setFileView('list'))}/>
                </div>
            <FileList/>
            <Popup/>
            <Uploader/>
            </div>
        :
        <div className="drop-area" onDrop={dropHandler} onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}  >put file here</div>
    )
}

export default Disk;