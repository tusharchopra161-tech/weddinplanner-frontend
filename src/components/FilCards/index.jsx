import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './filcards.css';
import { FaRegHeart, FaHeart, FaStar } from 'react-icons/fa';

export const FilCards = ({
    palaceId,
    image,
    name,
    location,
    price,
    rating
}) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate();
    const handleFavorite = () => {
        setIsFavorite((previous) => !previous);
    };
    const handleViewPalace = () => {
        if (!palaceId) {
            alert('Palace details are unavailable. Please try again.');
            return;
        }

        navigate(`/palace/${palaceId}`);
    };
    return (
        <div className="filter-card">

            {/* Palace Image */}
            <div className="filter-card-img">
                <img
                    src={image}
                    alt={name || 'Palace venue'}
                    loading="lazy"
                />

                <button
                    type="button"
                    className={`filter-heart ${isFavorite ? 'active' : ''}`}
                    onClick={handleFavorite}
                    aria-label={
                        isFavorite
                            ? `Remove ${name} from favorites`
                            : `Add ${name} to favorites`
                    }
                    aria-pressed={isFavorite}
                >
                    {isFavorite ? <FaHeart /> : <FaRegHeart />}
                </button>
            </div>

            {/* Palace Details */}
            <div className="filter-card-content">

                <div className="filter-card-info">
                    <div className="filter-card-title">
                        <h3>{name}</h3>
                        <p>{location}</p>
                    </div>

                    <div className="filter-rating">
                        <FaStar />
                        <span>{rating || 'New'}</span>
                    </div>
                </div>

                <p className="filter-price">
                    From <span>₹{price}</span>
                </p>

                <button
                    type="button"
                    className="view-palace"
                    onClick={handleViewPalace}
                >
                    View Palace
                </button>

            </div>
        </div>
    );
};
