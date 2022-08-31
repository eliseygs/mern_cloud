import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPopupDisplay } from '../../reducers/fileReducer';
import Input from '../../utils/input/Input';
import {createDir} from "../../actions/file"

const Popup=()=>{
    const [dirName, setDirName]=useState('')
    const popupDisplay= useSelector(state=> state.file.popupDisplay)
    const currentDir= useSelector(state=> state.file.currentDir)
    const dispatch= useDispatch()

    function createHandler(){
        dispatch(createDir(currentDir, dirName))
        setDirName('')
        dispatch(setPopupDisplay('none'))
    }
    return(
        <div className="popup" style={{display:popupDisplay}} onClick={()=> dispatch(setPopupDisplay('none'))} >
        <div className="popup__content" onClick={(event=> event.stopPropagation())}>
            <div className="popup__header">
                <div className="popup__title">create new dir</div>
                <button className="popup__close" onClick={()=> dispatch(setPopupDisplay('none'))}>x</button>
            </div>
        <Input type="text" placeHolder="input name dir" value={dirName} setValue={setDirName}/>
        <button className="popup__create" onClick={()=> createHandler()}>create </button>
        </div>
    </div>
    )
}
export default Popup;