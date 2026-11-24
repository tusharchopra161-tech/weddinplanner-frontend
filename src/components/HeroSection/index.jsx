import React, { useEffect, useRef } from 'react'
import "./heroSection.css"
import { FaHeart, FaArrowRight, FaCheckCircle } from "react-icons/fa"
import gsap from 'gsap'

export const HeroSection = () => {
    const heroRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: {
                    ease: "power3.out"
                }
            });

            tl.fromTo(
                ".hero-title",
                {
                    y: -40,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1
                }
            ).fromTo(
                    ".hero-description",
                    {
                        y: 25,
                        opacity: 0
                    },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8
                    },
                    "-=0.5"
                )
                .fromTo(
                    ".heroRight img",
                    {
                        opacity: 0,
                        scale: 0.95
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 1
                    },
                    "-=0.4"
                )
                .fromTo(
                    ".hero-buttons",
                    {
                        y: 20,
                        opacity: 0
                    },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.7
                    },
                    "-=0.4"
                );

        }, heroRef);

        return () => ctx.revert();

    }, []);
    return (
        <section className="heromain" ref={heroRef}>

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
