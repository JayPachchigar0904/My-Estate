import React, { useState } from 'react'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserFailure, updateUserSuccess, updateUserStart, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserSuccess, signOutUserStart } from '../Redux/users/userSlice'
import { Link, Navigate } from 'react-router-dom'

function Profile() {
  const fileRef = useRef(null)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch()
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const [showListingsError, setShowListingsError] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file)
    data.append("upload_preset", "My-Estate")
    data.append("cloud_name", "dati1ti2a")

    const res = await fetch("https://api.cloudinary.com/v1_1/dati1ti2a/image/upload", {
      method: 'POST',
      body: data,
    })

    const uploaded_image = await res.json()
    //console.log(uploaded_image)
    setFormData({ ...formData, avatar: uploaded_image.url });
  }

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);

    }
    catch (error) {
      setShowListingsError(true);
    }
  }

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      // <Navigate to = "/sign-up" />
    }
    catch (error) {
      //redux-toolkit for front end part
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout")
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    }
    catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    }
    catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }
  //console.log(currentUser.avatar)
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4 mx-auto' onSubmit={handleSubmit}>
        <input type="file" ref={fileRef} hidden accept="image/*" onChange={handleFileChange} />
        <img src={formData.avatar ? formData.avatar : currentUser.avatar} className='h-24 w-24 rounded-full object-cover self-center mt-2 cursor-pointer' alt="Profile Picture  " onClick={() => { fileRef.current.click() }} />
        <input type='text' placeholder='username' defaultValue={currentUser.username} className='border p-3 rounded-lg gap-4' id='username' onChange={handleChange} />
        <input type='email' placeholder='email' defaultValue={currentUser.email} className='border p-3 rounded-lg gap-4' id='email' onChange={handleChange} />
        <input type='password' placeholder='password' className='border p-3 rounded-lg gap-4' id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Update'}</button>
        <Link to="/create-listing" className="bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 text-center">Create Listing</Link>
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick={handleDelete} >Delete Account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'User is updated successfully!' : ''}</p>
      <button className='text-green-700 w-full' onClick={handleShowListings}>Show Listings</button>
      <p className='text-red-700 mt-5'>{showListingsError ? 'Error Showing Listings' : ''}</p>
{userListings && userListings.length > 0 && (
  <div className='flex flex-col gap-4'>
  <h1 className='text-center text-2xl font-semibold '>Your Listings</h1>
    {userListings.map((listing) => (
      <div
        key={listing._id}
        className="rounded-lg p-3 flex justify-between items-center gap-4 border">
        <Link to={`/listing/${listing._id}`}>
          <img
            className="h-16 w-16 object-contain"
            src={listing.imageUrls[0]}
            alt="listing image cover"
          />
        </Link>
        <Link
          className="text-slate-700 font-semibold flex-1 hover:underline truncate"
          to={`/listing/${listing._id}`}>
          <p>{listing.name}</p>
        </Link>
        <div className="flex flex-col">
          <button className="uppercase text-red-700">Delete</button>
          <button className="uppercase text-green-700">Edit</button>
        </div>
      </div>
    ))}
  </div>
)}

    </div>
  )
}

export default Profile;
