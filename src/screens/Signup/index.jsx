import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_BACKEND_URL;
export const Signup = () => {
  const navigate=useNavigate()
  const [form,setForm]=useState({
    
    name:"",
    mobileno:"",
    email:"",
    password:""
  })
  const handleChange= (e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value,
    });
  };

   const handleSubmit= async(e)=>{
   e.preventDefault();
   
    const res=await fetch(`${API_URL}/user`,{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(form)
    });
    console.log(res)
    
  }
  return (
    // <div className="w-full  min-h-[100vh] m-[20px] p-[20px]">
    //   <form onSubmit={handleSubmit} className="flex items-center justify-center flex-col gap-3">
    //     <input className="w-[40vw] h-12 rounded-2xl font-semibold text-2xl bg-amber-100 p-1" type="Number" name="mobileno" value={form.mobileNo} onChange={handleChange} placeholder="enter MobileNo"></input>
    //     <input className="w-[40vw] h-12 rounded-2xl font-semibold text-2xl bg-amber-100 p-1 " type="text" name="name" value={form.name} onChange={handleChange} placeholder="enter Name"></input>
    //     <input className="w-[40vw] h-12 rounded-2xl font-semibold text-2xl bg-amber-100 p-1" type="text" name="email" value={form.email} onChange={handleChange} placeholder="enter email"></input>
    //     <input className="w-[40vw] h-12 rounded-2xl font-semibold text-2xl bg-amber-100 p-1" type="text" name="password" value={form.password} onChange={handleChange} placeholder="enter password"></input>
    //     <button className="bg-[#FFD4D2]">
    //       Sign Up
    //     </button>
    //   </form>
    //   </div>
    <div className="w-full min-h-screen flex items-center justify-center bg-red-200 bg-[#faf7f8] px-5 py-10">

  <form
    onSubmit={handleSubmit}
    className="w-[100vh] max-w-[510px] flex flex-col gap-5 items-center bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-[30px] shadow-[0_20px_60px_rgba(105,32,101,0.12)] border border-red-200"
  >

    <div className="text-center mb-3">
      <h1 className="text-[#692065] text-4xl font-bold">
        Create Your Account
      </h1>

      <p className="text-gray-500 mt-2 text-sm">
        Start planning your perfect wedding with us
      </p>
    </div>

    <input
      className="w-[80%] h-14 rounded-2xl border border-gray-200 bg-white px-5 text-base outline-none transition focus:border-[#692065] focus:ring-2 focus:ring-[#692065]/20 placeholder:text-gray-400"
      type="text"
      name="name"
      value={form.name}
      onChange={handleChange}
      placeholder="Full Name"
    />

    <input
      className="w-[80%] h-14 rounded-2xl border border-gray-200 bg-white px-5 text-base outline-none transition focus:border-[#692065] focus:ring-2 focus:ring-[#692065]/20 placeholder:text-gray-400"
      type="number"
      name="mobileno"
      value={form.mobileno}
      onChange={handleChange}
      placeholder="Mobile Number"
    />

    <input
      className="w-[80%] h-14 rounded-2xl border border-gray-200 bg-white px-5 text-base outline-none transition focus:border-[#692065] focus:ring-2 focus:ring-[#692065]/20 placeholder:text-gray-400"
      type="email"
      name="email"
      value={form.email}
      onChange={handleChange}
      placeholder="Email Address"
    />

    <input
      className="w-[80%] h-14 rounded-2xl border border-gray-200 bg-white px-5 text-base outline-none transition focus:border-[#692065] focus:ring-2 focus:ring-[#692065]/20 placeholder:text-gray-400"
      type="password"
      name="password"
      value={form.password}
      onChange={handleChange}
      placeholder="Password"
    />

    <button
      type="submit"
      className="w-[80%] h-14 mt-2 rounded-2xl bg-[#692065] text-white text-lg font-semibold shadow-lg shadow-[#692065]/20 transition duration-300 hover:bg-[#541950] hover:scale-[1.01] active:scale-[0.98]"
    >
      Create Account
    </button>

    <p className="text-center text-sm text-gray-500 mt-1">
      Already have an account?
      <button onClick={()=>{navigate("/login")}} className="text-[#692065] font-semibold ml-1 cursor-pointer">
        Login
      </button>
    </p>

  </form>
</div>
  )
}
