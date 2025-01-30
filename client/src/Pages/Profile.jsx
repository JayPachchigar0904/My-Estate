import React, { useState } from 'react'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserFailure,updateUserSuccess,updateUserStart, deleteUserFailure, deleteUserStart, deleteUserSuccess,signOutUserFailure,signOutUserSuccess,signOutUserStart } from '../Redux/users/userSlice'
import { Navigate } from 'react-router-dom'

function Profile() {
  const fileRef = useRef(null)
  const [formData,setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch()
  const {currentUser, loading, error} = useSelector((state) => state.user)
  const handleChange = (e) => {
    setFormData({...formData,[e.target.id] : e.target.value})
  }
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const data = new FormData();
    data.append("file",file)
    data.append("upload_preset", "My-Estate")
    data.append("cloud_name","dati1ti2a")

    const res = await fetch("https://api.cloudinary.com/v1_1/dati1ti2a/image/upload",{
      method : 'POST',
      body : data,
    })

    const uploaded_image = await res.json()
    //console.log(uploaded_image)
    setFormData({...formData,avatar : uploaded_image.url});
  }

  const handleDelete = async () => {
    try{
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method : 'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
     // <Navigate to = "/sign-up" />
    }
    catch(error){
      //redux-toolkit for front end part
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async () => {
    try{
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout")
      const data = await res.json();
      if(data.success === false){
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data)); 
    }
    catch(error){
      dispatch(signOutUserFailure(error.message));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } 
    catch(error){
     dispatch(updateUserFailure(error.message));
    }
  }
  //console.log(currentUser.avatar)
  return (  
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4 mx-auto' onSubmit = {handleSubmit}>
      <input type = "file" ref = {fileRef} hidden accept = "image/*" onChange = {handleFileChange}/>
        <img src = {formData.avatar ? formData.avatar : currentUser.avatar} className='h-24 w-24 rounded-full object-cover self-center mt-2 cursor-pointer' alt = "Profile Picture  " onClick = {() => {fileRef.current.click()}}/>
        <input type = 'text' placeholder='username' defaultValue={currentUser.username} className='border p-3 rounded-lg gap-4' id = 'username' onChange = {handleChange}/>
        <input type = 'email' placeholder='email' defaultValue={currentUser.email} className='border p-3 rounded-lg gap-4' id = 'email' onChange = {handleChange}/>
        <input type = 'password' placeholder='password'  className='border p-3 rounded-lg gap-4' id = 'password' onChange = {handleChange}/>
        <button disabled = {loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...':'Update'}</button>
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick = {handleDelete} >Delete Account</span>
        <span onClick = {handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'User is updated successfully!' : ''}</p>
    </div>
  ) 
}

export default Profile
