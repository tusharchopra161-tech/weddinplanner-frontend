import React from 'react'
import "./heroSection.css"
import { FaHeart } from "react-icons/fa";
export const HeroSection = () => {
    return (
        <div className="heromain">
            <div className="heroLeft"></div>
            <div className="heroRight">
                <img src="https://i.pinimg.com/736x/3f/4c/e4/3f4ce4265b717aacce9b6b8378018292.jpg"></img>
                <div className="loveBYCouple text-sm">
                    <div className="circle"><FaHeart className="dil"/></div>
                    <div className='text-gray-700 text-xsm'>
                        <p className='text-[#692065] font-bold'>Loved by couples</p>
                        12,000+ celebrations
                    </div>
                </div>
            </div>
        </div>
    )
}
