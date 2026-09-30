import React, { useEffect } from 'react'
import "./HomeMiddle.css"
import gsap from "gsap"
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { Cards } from '../Cards'

gsap.registerPlugin(ScrollTrigger)
export const HomeMiddle = () => {
  const palacesImg=["https://i.pinimg.com/originals/65/6c/3b/656c3b1ef03a33eedf8c1e7d6fd24724.jpg",
    "https://i.pinimg.com/originals/65/6c/3b/656c3b1ef03a33eedf8c1e7d6fd24724.jpg",
    "https://i.pinimg.com/originals/65/6c/3b/656c3b1ef03a33eedf8c1e7d6fd24724.jpg"
  ];
  console.log("GSAP:", gsap);
console.log("Cards:", gsap.utils.toArray(".card2"));
  
  return (
    <div className='middle p-2 min-h-[100vh] flex flex-wrap items-center gap-3 '>
      
      {
        palacesImg.map((link,idx)=>{
          return <Cards className="card" id={idx} link={link}/>
        })
      }
      
    </div>
  )
}
