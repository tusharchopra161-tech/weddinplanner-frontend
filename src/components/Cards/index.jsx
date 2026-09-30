import React from 'react'
import { FaHeart, FaStar } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import gsap from "gsap"
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react';
export const Cards = (prop) => {
    // useEffect(()=>{
    // gsap.utils.toArray('.card').forEach(card=>{
    //   gsap.fromto('.card',
    //     {
    //     x: 300,
    //     opacity: 0,
    //     },{
    //     x: 0,
    //     opacity: 1,
    //     duration: 1,
    //     scrollTrigger: {
    //       trigger: card,
    //       start: "top 85%",
    //       end: "top 50%",
    //       scrub: true,
    //       markers:true,
    //     },
    //   })
      // console.log(card)
    // }
// )
//   },[])

useEffect(() => {
    const cards = gsap.utils.toArray(".card");

    cards.forEach((card) => {
      gsap.fromTo(
        card,
        {
          y: 300,
        //   stagger:2,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 3,
          scrollTrigger: {
              
            trigger: card,
            start: "top 90%",
            end: "top 50%",
            // scrub: true,
            markers: true,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
  return (
    
      <div className="card relative ms-1 overflow-hidden  bg-white w-[32.5%]  flex flex-col gap-5 rounded-3xl">
            <span className='absolute top-[12px] right-[1rem] z-[99] w-10 h-10 rounded-[50%] flex justify-center items-center bg-[#FFD4D2]'><FaRegHeart/></span>
            <img src={prop.link}></img>
            <div className="flex justify-between  ">
                <div style={{"padding-left":"20px"}}>
                    <h1 className='text-[#692065] text-3xl'>The Rosewood Palace</h1>
                    <p>Lake Como, Italy</p>
                </div> 
                <div style={{"padding-right":"20px"}} className="flex text-amber-400 text-2xl font-semibold">
                    <FaStar style={{"margin-top":"4.5px"}}/>4.2
                </div>
            </div>
            <p style={{"padding-left":"20px","padding-bottom":"6px"}}>From <span className="text-[#692065] font-semibold">₹8,500</span></p>
        </div>
    
            
  )
}
