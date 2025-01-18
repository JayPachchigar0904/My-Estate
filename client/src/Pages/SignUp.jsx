import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import OAuth from '../Components/OAuth';

function SignUp() {
  const [formData,setformData] = useState({})
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (event) => {
    setformData({
      ...formData,
      [event.target.id] : event.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();   
    setLoading(true);
    const res = await fetch('/api/auth/signup',
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
      setError(data.message);
      setLoading(false);
      return;
    }
    else{
      navigate('/sign-in');
    }
    setError(null);
    setLoading(false);
    // console.log(data)
  }
  // console.log(formData);
  return (
    <div className='p-3 mx-auto max-w-lg'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
      <input type = 'text' placeholder='username' className='border p-3 rounded-lg gap-4' id = 'username' onChange = {handleChange}/>
      <input type = 'email' placeholder='email' className='border p-3 rounded-lg gap-4' id = 'email' onChange = {handleChange}/>
      <input type = 'password' placeholder='password' className='border p-3 rounded-lg gap-4' id = 'password' onChange = {handleChange}/>
      <button disabled = {loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
      {loading ? 'Loading...':'Sign Up'}
      </button>
      <OAuth />
      </form>
       <div className='flex gap-2 my-5'>
       <p>Have an account?</p>
       <Link to = "/sign-in">
        <span className='text-blue-600'>Sign In</span>
       </Link>
       </div>
    </div>
  ) 
}

export default SignUp
