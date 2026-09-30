import React from 'react'
import { FaHeart } from "react-icons/fa";
import './footer.css'
export const Footer = () => {
  return (
    <div className="f-main">
      <div className="f-top">
        <div className="f-dil"><FaHeart/></div>
        <p id="tp">"WeddingPLanner made finding our dream venue feel effortless.<br></br>Every details was perfect."</p>
        <p>-- Amelia & James, married at The Rosewood Palace</p>
      </div>
      <div className="f-bottom">
        <div className="b-t">
          <div className="b-left">
            <img src=""/>
            <h3>WeddingPlanner</h3>
            <p>Beautiful places for beautiful beginnnings.</p>
            </div>
        <div className="b-middle">
          <div className="f-title">DISCOVER</div>
          <button className="f-btn">Find a palace</button>
          <button className="f-btn">Packages</button>
          <button className="f-btn">Inspiration</button>

        </div>
        <div className="b-right">
          <div className="f-title">COMPANY</div>
          <button className="f-btn">About Us</button>
          <button className="f-btn">Partner With Us</button>
          <button className="f-btn">Contact</button>
        </div>
        </div>
        
        <div className="b-b"> <hr className='text-white'></hr>
        <p>2026 WeddingPlanner. Made for forever</p>
        </div>
       
      </div>

    </div>
  )
}
