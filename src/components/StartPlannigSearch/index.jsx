import React from 'react'
import "./startplanningsearch.css"
import { TiLocationOutline } from "react-icons/ti";
import { SlCalender } from "react-icons/sl";
import { LuUsers } from "react-icons/lu";
export const StartPLannigSearch = () => {
  return (
    <div className="start-main">
      <h2 className="text-2xl font-semibold">Start PLannig Your perfect day</h2>
      <div className='flex'>
        <span><TiLocationOutline className='s-sign' /> Where</span>
        <span><SlCalender className='s-sign' /> When</span>
        <span><LuUsers className='s-sign' /> Guest</span>
      </div>
      <input className='s-input' type="text" name="" id="" placeholder="Search city or region" />
      <input className='s-input' type="date" name="" id="" placeholder="Choose a date" />
      <input className='s-input' type="number" name="" id="" placeholder="Number of guests" />
      <button className="s-btn">Search Palaces</button>
    </div>
  )
}
