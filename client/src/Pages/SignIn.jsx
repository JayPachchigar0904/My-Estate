import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signInStart,signInSuccess,signInFailure } from '../Redux/users/userSlice';
import OAuth from '../Components/OAuth';

function SignIn() {
  const [formData,setformData] = useState({})
  const {loading, error} = useSelector((state) => state.user)//.user bcoz it is the name of slice given
  const navigate = useNavigate();
const dispatch = useDispatch();

  const handleChange = (event) => {
    setformData({
      ...formData,
      [event.target.id] : event.target.value,
    });
  };
  const handleSubmit = async (e) => {
    try{
      e.preventDefault();   
      // setLoading(true);
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin',
        {
          method : 'POST',
          headers : {
            'Content-Type' : 'application/json'
          },
          body : JSON.stringify(formData)
        }
      );
      const data = await res.json();
      if(data.success === false){
        dispatch(signInFailure(data.message))
        return;
      }
      else{
        dispatch(signInSuccess(data))
        navigate('/');
      }
    }
   catch(error){
    dispatch(signInFailure(error.message))
   }
  }

  return (
    <div className='p-3 mx-auto max-w-lg'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
      <input type = 'email' placeholder='email' className='border p-3 rounded-lg gap-4' id = 'email' onChange = {handleChange}/>
      <input type = 'password' placeholder='password' className='border p-3 rounded-lg gap-4' id = 'password' onChange = {handleChange}/>
      <button disabled = {loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
      {loading ? 'Loading...':'Sign In'}
      </button>
      <OAuth/>
      </form>
       <div className='flex gap-2 my-5'>
       <p>Don't Have an account?</p>
       <Link to = "/sign-up">
        <span className='text-blue-600'>Sign Up</span>
       </Link>
       </div>
    </div>
  ) 
}

export default SignIn
