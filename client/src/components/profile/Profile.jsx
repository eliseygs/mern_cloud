import React from "react";
import { useDispatch } from "react-redux";
import { deleteAvatar, postAvatar } from "../../actions/user";

const Profile =()=>{
const dispatch= useDispatch()
    function changeHandler(e){
        const file= e.target.files[0]
        dispatch(postAvatar(file))
    }
    return(
        <div>
            <button onClick={()=> dispatch(deleteAvatar())}>
                delete
            </button>
            <input accept="image/*" onChange={e=>changeHandler(e)} type="file" placeholder="upload avatar"/>
        </div>
    )
}
export default Profile