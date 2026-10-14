import React, { useState } from 'react'
import './profilecard.css'
export const ProfileCard = (props) => {
 const handlelog=()=>{
  // console.log(props)
  localStorage.removeItem("currentUser")
  props.onLogot()
 }


  return (
    <div className="pcard bg-[#FCF6E9] rounded-xl h-[17%] w-[17%] flex flex-col gap-2">
      <div>
        <button onClick={()=>console.log("hi")} className='text-[#692065] text-xl'>{props.user.name}</button>
        <p className='pemail text-[#654E63] text-[2.5vh]'>{props.user.email}</p>
      </div>
      
      <div>
        <button onClick={handlelog} className='logbtn text-[#692065] font-semibold text-xl justify-start w-[40%]'>Log Out</button>
      </div>
    </div>

  )
}
