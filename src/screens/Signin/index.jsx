import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
export const Signin = () => {
  const [form,setForm]=useState({
      name:"",
      password:""
    })
    const handleChange= (e)=>{
      setForm({
        ...form,
        [e.target.name]:e.target.value,
      });
    };
    const handleSubmit=async(e)=>{
      e.preventDefault()
      const userexist=await fetch("https://weddingplannerbackend-vaq7.onrender.com/user/login",{
        method:"post",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(form)
      }) ;
    }
  const navigate= useNavigate()
  return (
    <div className="flex justify-center items-center flex flex-col w-full bg-red-200 min-h-screen ">
      <form onSubmit={handleSubmit} className=" rounded-[30px] bg-white/70 h-[70vh]  flex flex-col justify-between p-8 md:p-10 backdrop-blur-xl p-8 md:p-10 rounded-[30px] shadow-[0_20px_60px_rgba(105,32,101,0.12)] border border-red-200">
        <div className='flex flex-col w-[80vh] items-center gap-[3rem] '>
          <div className="text-center mb-3">
      <h1 className="text-[#692065] text-4xl font-bold">
        LogIn
      </h1>
      <p className="text-gray-500 mt-2 text-sm">
        Start planning your perfect wedding with us
      </p>
    </div>
        <input className='w-[63vh] h-14 rounded-2xl border border-gray-200 bg-white px-5 text-base outline-none transition focus:border-[#692065] focus:ring-2 focus:ring-[#692065]/20 placeholder:text-gray-400' type="text" name="name" id="name" placeholder="Enter Your Name" onChange={handleChange}/>
        <input className='w-[63vh] h-14 rounded-2xl border border-gray-200 bg-white px-5 text-base outline-none transition focus:border-[#692065] focus:ring-2 focus:ring-[#692065]/20 placeholder:text-gray-400' type="password" name="password" id="password" placeholder='Enter Password' onChange={handleChange}/>
        <button className="w-[80%] h-14 mt-2 rounded-2xl bg-[#692065] text-white text-lg font-semibold shadow-lg shadow-[#692065]/20 transition duration-300 hover:bg-[#541950] hover:scale-[1.01] active:scale-[0.98]">Login</button>
       </div>
      <div className="bottom flex items-center justify-center">
        <p className='text-center text-sm text-gray-500 mt-1'>don't have account</p><button type="submit" className='text-blue-600' onClick={()=>{navigate("/signup")}}>signup</button>
      </div>
      </form>
    </div>
  )
}
