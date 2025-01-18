import React from 'react'
import { useSelector } from 'react-redux'

function Profile() {
  const {currentUser} = useSelector((state) => state.user)
  const handleChange = () => {

  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4 mx-auto'>
        <img src={currentUser.avatar} className='h-24 w-24 rounded-full object-cover self-center mt-2 cursor-pointer' alt = "profile picture"/>
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
