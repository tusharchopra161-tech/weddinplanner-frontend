import React, { useEffect } from 'react'
import "./HomeMiddle.css"
import gsap from "gsap"
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Cards } from '../Cards'
import { useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)
export const HomeMiddle = () => {
  const palacesImg=["https://i.pinimg.com/originals/65/6c/3b/656c3b1ef03a33eedf8c1e7d6fd24724.jpg",
    "https://i.pinimg.com/originals/65/6c/3b/656c3b1ef03a33eedf8c1e7d6fd24724.jpg",
    "https://i.pinimg.com/originals/65/6c/3b/656c3b1ef03a33eedf8c1e7d6fd24724.jpg"
  ];
  console.log("GSAP:", gsap);
console.log("Cards:", gsap.utils.toArray(".card2"));
const tl=gsap.timeline()

const scrollRef=useRef()
//========= simple gsap on cards===========
  // useGSAP(()=>{
  //     tl.from(".card",{
  //       y:300,
  //       opacity:0,
  //       delay:2,
  //       duration:2,
  //       stagger:{
  //         amount:1,
  //         grid:[2,1],
  //         ease:'bounce'
  //         // from:"center"
  //       },
  //       // repeat:-1,
  //       // yoyo:true,
  //       rotate:-360
  //     })
  //   },[])
//=========scroll gsap=====================
useGSAP(()=>{
  const cs=gsap.utils.toArray(scrollRef.current.children)
  cs.forEach((c)=>{
    gsap.from(c,{
      y:300,
      rotation:10,
      // borderRadius:"100%",
      scale:-0.5,
      stagger:1,
      duration:1,
      scrollTrigger:{
        trigger:c,
        start:'bottom, bottom',
        end:'top 80%',
        // scrub:true,
        // markers:true,
      }
    })
  })
})
  return (
    <div ref={scrollRef} className='middle p-2 min-h-[100vh] flex flex-wrap items-center gap-3 '>
      
      {
        palacesImg.map((link,idx)=>{
          return <Cards className="card" id={idx} link={link}/>
        })
      }
      
    </div>
  )
}
