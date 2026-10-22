import { useState } from 'react'
import {
    FaHeart,
    FaStar,
    FaRegHeart,
    FaMapMarkerAlt,
    FaArrowRight
} from 'react-icons/fa'
import './card.css'

export const Cards = (prop) => {
    const [isFavorite, setIsFavorite] = useState(false)

    return (
        <article className="venue-card">
            <div className="venue-card-image">
                <img
                    src={prop.link}
                    alt={prop.name || "Wedding palace"}
                    loading="lazy"
                />

                <span className="venue-badge">Popular Venue</span>

                <button
                    type="button"
                    className={`venue-favorite ${isFavorite ? 'active' : ''}`}
                    onClick={() => setIsFavorite(!isFavorite)}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    aria-pressed={isFavorite}
                >
                    {isFavorite ? <FaHeart /> : <FaRegHeart />}
                </button>
            </div>

            <div className="venue-card-content">
                <div className="venue-card-top">
                    <div className="venue-card-info">
                        <h3>{prop.name || "The Rosewood Palace"}</h3>

                        <p className="venue-location">
                            <FaMapMarkerAlt />
                            {prop.location || "Lake Como, Italy"}
                        </p>
                    </div>

                    <div className="venue-rating">
                        <FaStar />
                        <span>{prop.rating || "4.2"}</span>
                    </div>
                </div>

                <div className="venue-card-footer">
                    <p className="venue-price">
                        From <strong>{prop.price || "₹8,500"}</strong>
                    </p>

                    <button
                        type="button"
                        className="venue-view-btn"
                        onClick={() => {
                            if (prop.onView) {
                                prop.onView(prop.id)
                            }
                        }}
                        aria-label={`View ${prop.name || "venue"} details`}
                    >
                        <FaArrowRight />
                    </button>
                </div>
            </div>
        </article>
    )
}