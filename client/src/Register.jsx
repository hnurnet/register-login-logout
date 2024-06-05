import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";


function Register() {
  const [values,setValues] = useState({name:'',email:'',password:''});
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:8800/register", values)
    .then(res => {
      if(res.data.status === "Success"){
        navigate("/login")

      }
      else {
        alert("Error")
      }
    })
    .then(err => console.log(err))
  }

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      <div className='bg-white p-3 rounded w-50'>
        <h2>Sign-up</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label><strong>Name</strong></label>
            <input type='text' placeholder='Enter Name' name='name' 
            onChange={e=>setValues({...values, name: e.target.value})}
            className='form-control rounded-0'/>
          </div>
          <div className='mb-3'>
            <label><strong>Email</strong></label>
            <input type='text' placeholder='Enter Name' name='email' 
            onChange={e=>setValues({...values, email: e.target.value})}
            className='form-control rounded-0'/>
          </div>
          <div className='mb-3'>
            <label><strong>Password</strong></label>
            <input type='text' placeholder='Enter Name' name='password' 
            onChange={e=>setValues({...values, password: e.target.value})}
            className='form-control rounded-0'/>
          </div>
          <button type='submit' className='btn btn-success w-100 rounded-0'>Create Account</button>
          <p className='text-center'>You are agrees to our terms and policies</p>
          <Link to="/login" type='submit' className='btn btn-default w-100 
          rounded-0 bg-light text-decoration-none'>Login</Link>
        </form>
      </div>
    </div>
  )
}

export default Register

