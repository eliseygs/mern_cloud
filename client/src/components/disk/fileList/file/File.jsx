
import React, { useState } from "react";
import './file.less'
import dirLogo from '../../../../assets/img/dir.svg'
import fileLogo from'../../../../assets/img/file.svg'
import { show, hide, pushToStack, setCurrentDir } from "../../../../reducers/fileReducer";
import { useDispatch, useSelector } from "react-redux";
import { deleteFile, downloadFile } from "../../../../actions/file"
import sizeFormat from "../../../../utils/sizeFormat";
const File= ({file})=>{
    const dispatch= useDispatch()
    const currentDir= useSelector(state=> state.file.currentDir)
    const fileView= useSelector(state=> state.file.view)
    function openDirHandler(file){
       if(file.type === 'dir') {
        dispatch(pushToStack(currentDir)) 
        dispatch(setCurrentDir(file.id))
       }
    }
    function downloadClickHandler(e){
        e.stopPropagation()
        downloadFile(file)
    }
    function deleteClickHandler(e){
        e.stopPropagation()
        dispatch(deleteFile(file))
    }
    //console.log(invisible)
    if(fileView==='plate'){
        <div className="file-plate" onClick={()=>openDirHandler(file)}>
            <img src={file.type ==='dir' ? dirLogo : fileLogo} alt="" className="file-plate__img"/>
            <div className="file-plate__name">{file.name}</div>
            <div>
                {file.type !== 'dir' && 
                <button onClick={(e) => downloadClickHandler(e)} className="file-plate__btn file-plate__download">download</button>}
                <button className="file-plate__btn file-plate__delete" onClick={(e)=> deleteClickHandler(e)}>delete</button>
            </div>
        </div>
    }
    if(fileView==='list'){
    return(
        <div className="file" onClick={()=>openDirHandler(file)}>
            <img src={file.type ==='dir' ? dirLogo : fileLogo} alt="" className="file__img"/>
            <div className="file__name">{file.name}</div>
            <div className="file__date">{file.date.slice(0,10)}</div>
            <div className="file__size">{sizeFormat(file.size)}</div>
            {file.type !== 'dir' && <button onClick={(e) => downloadClickHandler(e)} className="file__btn file__download">download</button>}
            <button className="file__btn file__delete" onClick={(e)=> deleteClickHandler(e)}>delete</button>
        </div>
    )

    }
}

export default File;