import React, { useState } from 'react'
import { useRef } from 'react'
import { useSelector } from 'react-redux'

function Profile() {
  const fileRef = useRef(null)
  const [formData,setFormData] = useState({})
  const {currentUser} = useSelector((state) => state.user)
  const handleChange = () => {

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
  //console.log(currentUser.avatar)
  return (  
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4 mx-auto'>
      <input type = "file" ref = {fileRef} hidden accept = "image/*" onChange = {handleFileChange}/>
        <img src = {formData.avatar ? formData.avatar : currentUser.avatar} className='h-24 w-24 rounded-full object-cover self-center mt-2 cursor-pointer' alt = "Profile Picture  " onClick = {() => {fileRef.current.click()}}/>
        <input type = 'text' placeholder='username' className='border p-3 rounded-lg gap-4' id = 'username' onChange = {handleChange}/>
        <input type = 'email' placeholder='email' className='border p-3 rounded-lg gap-4' id = 'email' onChange = {handleChange}/>
        <input type = 'password' placeholder='password' className='border p-3 rounded-lg gap-4' id = 'password' onChange = {handleChange}/>
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>update</button>
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}

export default Profile
