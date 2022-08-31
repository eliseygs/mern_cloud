
import {
  CSSTransition,
  SwitchTransition,
  Transition,
  TransitionGroup,
} from 'react-transition-group';
import React, { useState } from "react";
import { useSelector } from "react-redux";
import File from "./file/File";
import './fileList.less'

const FileList= ()=>{
    const files= useSelector(state=> state.file.files)
    const methodFile=useSelector(state=> state.file.methodFile)
    const fileView=useSelector(state=> state.file.view)
    //const [mode, setMode]= useState(in-out")
    if(files.length ===0){
        return(
            <div className="loader">files is underfined</div>
        )
    }
    if(fileView==='plate'){
        return(
        <div className='fileplate'>
            {files.map(file=>
                <File key={file.id} file={file}/>
            )}
        </div>
        )
    }
    if(fileView==='list'){
    return(
            <div className="filelist">
                <div className="filelist__header">
                    <div className="filelist__name">Name</div>
                    <div className="filelist__date">Date</div>
                    <div className="filelist__size">Size</div>
                </div>
               <TransitionGroup >
                   {files.map(file=>
                   <CSSTransition
                       key={file.id}
                       timeout={500}
                       classNames={'file'}
                       //mountOnEnter
                       //unmountOnExit
                       >
                       <File file={file}/>
                   </CSSTransition>
                   )}
               </TransitionGroup>
            </div>
    )
    }
}

export default FileList;