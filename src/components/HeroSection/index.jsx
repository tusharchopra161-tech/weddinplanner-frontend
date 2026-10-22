// import React from 'react'
// import "./heroSection.css"
// import { FaHeart } from "react-icons/fa";
// export const HeroSection = () => {
//     return (
//         <div className="heromain">
//             <div className="heroLeft"></div>
//             <div className="heroRight">
//                 <img src="https://i.pinimg.com/736x/3f/4c/e4/3f4ce4265b717aacce9b6b8378018292.jpg"></img>
//                 <div className="loveBYCouple text-sm">
//                     <div className="circle"><FaHeart className="dil"/></div>
//                     <div className='text-gray-700 text-xsm'>
//                         <p className='text-[#692065] font-bold'>Loved by couples</p>
//                         12,000+ celebrations
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
import React from 'react'
import "./heroSection.css"
import { FaHeart, FaArrowRight, FaCheckCircle } from "react-icons/fa"

export const HeroSection = () => {
    return (
        <section className="heromain">

            {/* Left Content */}
            <div className="heroLeft">

                <div className="hero-badge">
                    <FaHeart />
                    <span>Your journey to forever starts here</span>
                </div>

                <h1 className="hero-title">
                    Your Dream Wedding,
                    <span> Beautifully Planned.</span>
                </h1>

                <p className="hero-description">
                    Discover breathtaking wedding palaces, explore beautiful
                    venues, and make every moment of your special day
                    unforgettable.
                </p>

                <div className="hero-buttons">
                    <button
                        className="hero-primary-btn"
                        onClick={() => window.location.href = "/palaces"}
                    >
                        Explore Palaces <FaArrowRight />
                    </button>

                    <button
                        className="hero-secondary-btn"
                        onClick={() => {
                            document.querySelector(".start-main")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }}
                    >
                        Plan Your Wedding
                    </button>
                </div>

                <div className="hero-trust">
                    <div className="hero-trust-item">
                        <FaCheckCircle />
                        <span>Beautiful Venues</span>
                    </div>

                    <div className="hero-trust-item">
                        <FaCheckCircle />
                        <span>Easy Planning</span>
                    </div>

                    <div className="hero-trust-item">
                        <FaCheckCircle />
                        <span>Unforgettable Moments</span>
                    </div>
                </div>

            </div>

            {/* Right Image */}
            <div className="heroRight">

                <img
                    src="https://i.pinimg.com/736x/3f/4c/e4/3f4ce4265b717aacce9b6b8378018292.jpg"
                    alt="Beautiful romantic wedding venue"
                />

                <div className="loveBYCouple">
                    <div className="circle">
                        <FaHeart className="dil" />
                    </div>

                    <div className="hero-couple-text">
                        <p>Loved by couples</p>
                        <span>12,000+ celebrations</span>
                    </div>
                </div>

            </div>

        </section>
    )
}
