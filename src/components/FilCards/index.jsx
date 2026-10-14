import './filcards.css'
    import React from 'react'
import { FaRegHeart, FaStar } from 'react-icons/fa'

export const FilCards = ({
    image,
    name,
    location,
    price,
    rating
}) => {
    return (
        <div className="filter-card">

            {/* Image */}
            <div className="filter-card-img">
                {/* <img src={image} alt={name} /> */}

                <div className="filter-heart">
                    <FaRegHeart />
                </div>
            </div>

            {/* Details */}
            <div className="filter-card-content">

                <div className="filter-card-info">

                    <div>
                        <h3>{name}</h3>
                        <p>{location}</p>
                    </div>

                    <div className="filter-rating">
                        <FaStar />
                        <span>{rating}</span>
                    </div>

                </div>

                <p className="filter-price">
                    From <span>₹{price}</span>
                </p>

                <button className="view-palace">
                    View Palace
                </button>

            </div>

        </div>
    )
}
