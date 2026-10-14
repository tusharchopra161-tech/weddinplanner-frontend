import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// const API_URL = import.meta.env.BACKEND_URL;
export const Signup = () => {
   const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()
  const [form,setForm]=useState({
    name:"",
    mobileno:"",
    email:"",
    password:"",
    role:"user"
  })
  const handleChange= (e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value,
    });
  };

   const handleSubmit= async(e)=>{
    console.log(form)
   e.preventDefault();
   setMessage("");
   try{
    setLoading(true);
    const res=await fetch(`https://weddingplannerbackend-vaq7.onrender.com/user`,{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(form)
    });
    const resjson=await res.json()
    console.log(resjson)
    if(resjson){
      navigate("/login")
    }else{
      setMessage(resjson.message || "Signup failed");
      navigate("/signup")
    }
   }catch(err){
    setMessage("Unable to connect to the server. Please try again.");
   }finally{
     setLoading(false);
   }
  }
  return (
    
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
    <div className="w-[80%]">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Create account as
          </label>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full h-14 rounded-2xl border border-gray-200 bg-white px-5 outline-none focus:border-[#692065]"
          >
            <option value="user">User — Plan my wedding</option>
            <option value="owner">Palace Owner — List my palace</option>
          </select>
        </div>
        {message && (
          <p className="w-[80%] text-sm text-red-600 text-center">
            {message}
          </p>
        )}
    <button
      type="submit"
      className="w-[80%] h-14 mt-2 rounded-2xl bg-[#692065] text-white text-lg font-semibold shadow-lg shadow-[#692065]/20 transition duration-300 hover:bg-[#541950] hover:scale-[1.01] active:scale-[0.98]"
    >
     {loading ? "Creating Account..." : "Create Account"}
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
