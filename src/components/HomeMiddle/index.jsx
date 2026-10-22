
import React, { useRef } from 'react'
import "./HomeMiddle.css"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { FaHeart } from "react-icons/fa"
import { Cards } from "../Cards"

gsap.registerPlugin(ScrollTrigger)

export const HomeMiddle = () => {
    const scrollRef = useRef(null)

    const palacesImg = [
        "https://i.pinimg.com/originals/65/6c/3b/656c3b1ef03a33eedf8c1e7d6fd24724.jpg",
        "https://i.pinimg.com/originals/65/6c/3b/656c3b1ef03a33eedf8c1e7d6fd24724.jpg",
        "https://i.pinimg.com/originals/65/6c/3b/656c3b1ef03a33eedf8c1e7d6fd24724.jpg"
    ]

    useGSAP(() => {
        const cards = gsap.utils.toArray(".home-middle-card")

        cards.forEach((card) => {
            gsap.from(card, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            })
        })
    }, { scope: scrollRef })

    return (
        <section className="home-middle-section">
            <div className="middle-heading">
                <span className="middle-eyebrow">
                    <FaHeart /> MADE FOR YOUR SPECIAL DAY
                </span>

                <h2>
                    Discover Your <span>Dream Venue</span>
                </h2>

                <p>
                    From grand wedding palaces to beautiful celebration spaces,
                    find the perfect setting for your forever memories.
                </p>
            </div>

            <div ref={scrollRef} className="middle">
                {palacesImg.map((link, idx) => (
                    <div className="home-middle-card" key={idx}>
                        <Cards
                            className="card"
                            id={idx}
                            link={link}
                        />
                    </div>
                ))}
            </div>

            <div className="middle-bottom-text">
                <span>♡</span>
                Your perfect wedding venue is waiting for you.
            </div>
        </section>
    )
}