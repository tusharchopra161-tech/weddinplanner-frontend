
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    FaHeart,
    FaRegHeart,
    FaStar,
    FaMapMarkerAlt,
    FaLandmark,
    FaTree,
    FaHotel,
    FaArrowRight,
    FaRegCalendarAlt,
    FaUsers,
    FaShieldAlt,
    FaBars
} from 'react-icons/fa';
import './palaceDetails.css';

const API_URL = 'https://weddingplanner-backend.onrender.com';

export const PalaceDetails = () => {
    const { palaceId } = useParams();
    const navigate = useNavigate();

    const [palace, setPalace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [favorite, setFavorite] = useState(false);
    const [activeTab, setActiveTab] = useState('Overview');
    const [showFullDescription, setShowFullDescription] = useState(false);

    const [form, setForm] = useState({
        weddingDate: '',
        guestCount: '',
        specialRequests: ''
    });

    useEffect(() => {
        const fetchPalace = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await fetch(`${API_URL}/palace/${palaceId}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Unable to load this venue.');
                }

                const selectedPalace = data.palace || data;

                if (!selectedPalace?._id) {
                    throw new Error('Palace details could not be found.');
                }

                setPalace(selectedPalace);
            } catch (err) {
                setError(err.message || 'Unable to load palace details.');
            } finally {
                setLoading(false);
            }
        };

        fetchPalace();
    }, [palaceId]);

    const images = Array.isArray(palace?.Images)
        ? palace.Images.map((item) =>
            typeof item === 'string' ? item : item?.url
        ).filter(Boolean)
        : Array.isArray(palace?.images)
            ? palace.images.map((item) =>
                typeof item === 'string' ? item : item?.url
            ).filter(Boolean)
            : [];

    const mainImage = images[0] || palace?.image || '';

    const description =
        palace?.description ||
        'A beautiful venue for celebrating your special day with family and friends.';

    const facilities = Array.isArray(palace?.facilities)
        ? palace.facilities
        : [];

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((previous) => ({ ...previous, [name]: value }));
    };
    const getMinWeddingDate = () => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + 20);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };
    const handleBooking = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');

        let currentUser;

        try {
            currentUser = JSON.parse(
                localStorage.getItem('currentUser') || 'null'
            );
        } catch {
            currentUser = null;
        }

        const token = localStorage.getItem('token');

        if (!currentUser || !token) {
            navigate('/login');
            return;
        }

        if (currentUser.role && currentUser.role !== 'user') {
            setError('Only customer accounts can request a booking.');
            return;
        }

        const guests = Number(form.guestCount);
        const selectedDate = new Date(`${form.weddingDate}T00:00:00`);

        const minDate = new Date();
        minDate.setHours(0, 0, 0, 0);
        minDate.setDate(minDate.getDate() + 20);

        if (
            !form.weddingDate ||
            Number.isNaN(selectedDate.getTime()) ||
            selectedDate < minDate
        ) {
            setError('Please book at least 20 days before your wedding date.');
            return;
        }

        if (!Number.isInteger(guests) || guests < 1) {
            setError('Please enter a valid guest count.');
            return;
        }

        if (Number(palace.capacity) > 0 && guests > Number(palace.capacity)) {
            setError(`This venue can accommodate up to ${palace.capacity} guests.`);
            return;
        }

        try {
            setSubmitting(true);

            const response = await fetch(`${API_URL}/booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    palaceId: palace._id,
                    weddingDate: form.weddingDate,
                    guestCount: guests,
                    specialRequests: form.specialRequests
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Booking request failed.');
            }

            setMessage(
                data.message || 'Your booking request has been submitted.'
            );

            setForm({
                weddingDate: '',
                guestCount: '',
                specialRequests: ''
            });
        } catch (err) {
            setError(err.message || 'Unable to submit your request.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="pd-status">
                <span className="pd-loader" />
                <p>Finding your perfect venue...</p>
            </div>
        );
    }

    if (!palace) {
        return (
            <div className="pd-status">
                <h2>Venue unavailable</h2>
                <p>{error || 'We could not find this palace.'}</p>
                <button onClick={() => navigate('/palaces')}>
                    Explore palaces
                </button>
            </div>
        );
    }

    const tabs = ['Overview', 'Spaces & capacity', 'Packages', 'Reviews'];

    const displayPrice = Number(palace.price || 0).toLocaleString('en-IN');

    return (
        <main className="pd-page">
            {/* Navigation */}
            <header className="pd-header">
                <button
                    className="pd-mobile-menu"
                    aria-label="Back to palaces"
                    onClick={() => navigate('/palaces')}
                >
                    <FaBars />
                </button>

                <button
                    className="pd-brand"
                    onClick={() => navigate('/')}
                    aria-label="Vow and Vine home"
                >
                    VOW <span>&</span> VINE
                </button>

                <nav className="pd-nav-links">
                    <button onClick={() => navigate('/palaces')}>Venues</button>
                    <button onClick={() => navigate('/palaces')}>Vendors</button>
                    <button onClick={() => navigate('/palaces')}>Inspiration</button>
                    <button onClick={() => navigate('/palaces')}>Planning tools</button>
                </nav>

                <div className="pd-header-actions">
                    <button
                        onClick={() => setFavorite((previous) => !previous)}
                    >
                        {favorite ? <FaHeart /> : <FaRegHeart />}
                        <span>Saved</span>
                    </button>
                    <span className="pd-avatar">AM</span>
                    <button onClick={() => navigate('/login')}>My wedding</button>
                </div>
            </header>

            <div className="pd-container">
                {/* Breadcrumb */}
                <div className="pd-breadcrumb">
                    <button onClick={() => navigate('/palaces')}>Venues</button>
                    <span>›</span>
                    <span>{palace.location || 'Your destination'}</span>
                    <span>›</span>
                    <span>Palace venues</span>

                    <button
                        className={`pd-mobile-heart ${favorite ? 'is-active' : ''}`}
                        aria-label="Save venue"
                        onClick={() => setFavorite((previous) => !previous)}
                    >
                        {favorite ? <FaHeart /> : <FaRegHeart />}
                    </button>
                </div>

                {/* Title and highlights */}
                <section className="pd-title-row">
                    <div className="pd-title-copy">
                        <h1>{palace.name}</h1>

                        <p className="pd-location">
                            <FaMapMarkerAlt />
                            {palace.location || 'Beautiful wedding destination'}
                            <span> · Palace venue</span>
                        </p>

                        <div className="pd-rating">
                            <span className="pd-stars" aria-label="Venue rating">
                                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                            </span>
                            <strong>{palace.rating || 'New'}</strong>
                            <span>{palace.rating ? 'Guest rating' : 'Be among the first to visit'}</span>
                        </div>

                        <p className="pd-short-description">
                            {description.length > 170
                                ? `${description.slice(0, 170)}…`
                                : description}
                        </p>
                    </div>

                    <aside className="pd-love-card">
                        <h3>Why couples love it</h3>
                        <div className="pd-love-items">
                            <div>
                                <FaLandmark />
                                <span>Unique venue</span>
                            </div>
                            <div>
                                <FaTree />
                                <span>Special celebrations</span>
                            </div>
                            <div>
                                <FaHotel />
                                <span>One-site stay</span>
                            </div>
                        </div>
                    </aside>
                </section>

                {/* Gallery */}
                <section className="pd-main-grid">
                    <div className="pd-left-column">
                        <div className="pd-gallery">
                            <div className="pd-gallery-main">
                                {mainImage ? (
                                    <img src={mainImage} alt={palace.name} />
                                ) : (
                                    <div className="pd-image-placeholder">
                                        <FaLandmark />
                                        <span>{palace.name}</span>
                                    </div>
                                )}

                                <span className="pd-photo-count">
                                    View all photos · {images.length || 1}
                                </span>
                            </div>

                            <div className="pd-gallery-side">
                                <div className="pd-gallery-tile pd-tile-gold">
                                    {images[1] ? (
                                        <img src={images[1]} alt={`${palace.name} venue`} />
                                    ) : (
                                        <div className="pd-line-art pd-line-arch" />
                                    )}
                                    <span>Grand celebrations</span>
                                </div>

                                <div className="pd-gallery-tile pd-tile-green">
                                    {images[2] ? (
                                        <img src={images[2]} alt={`${palace.name} grounds`} />
                                    ) : (
                                        <div className="pd-line-art pd-line-garden" />
                                    )}
                                    <span>Explore the grounds</span>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <nav className="pd-tabs" aria-label="Venue information">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    className={activeTab === tab ? 'active' : ''}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>

                        {/* Overview */}
                        <section className="pd-overview">
                            {activeTab === 'Overview' && (
                                <>
                                    <h2>A celebration made unforgettable</h2>
                                    <p className={showFullDescription ? 'expanded' : ''}>
                                        {description}
                                    </p>
                                    <button
                                        className="pd-read-more"
                                        onClick={() => setShowFullDescription((previous) => !previous)}
                                    >
                                        {showFullDescription ? 'Read less' : 'Read more'}
                                        <FaArrowRight />
                                    </button>

                                    <div className="pd-facts">
                                        <div>
                                            <span>Guest capacity</span>
                                            <strong>
                                                {palace.capacity
                                                    ? `Up to ${palace.capacity} guests`
                                                    : 'Contact venue'}
                                            </strong>
                                        </div>
                                        <div>
                                            <span>Best for</span>
                                            <strong>Wedding celebrations</strong>
                                        </div>
                                        <div>
                                            <span>Venue type</span>
                                            <strong>Palace · Wedding venue</strong>
                                        </div>
                                        <div>
                                            <span>Starting price</span>
                                            <strong>From ₹{displayPrice}</strong>
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'Spaces & capacity' && (
                                <div className="pd-tab-content">
                                    <h2>Spaces for every moment</h2>
                                    <p>
                                        Plan your celebration with the venue capacity and
                                        facilities available at this palace.
                                    </p>
                                    <p>
                                        <strong>Guest capacity:</strong>{' '}
                                        {palace.capacity || 'Please contact the venue'}
                                    </p>
                                </div>
                            )}

                            {activeTab === 'Packages' && (
                                <div className="pd-tab-content">
                                    <h2>Venue pricing</h2>
                                    <p>
                                        Starting price: <strong>₹{displayPrice}</strong>
                                    </p>
                                    <p>Submit an availability request to discuss your celebration requirements.</p>
                                </div>
                            )}

                            {activeTab === 'Reviews' && (
                                <div className="pd-tab-content">
                                    <h2>Guest reviews</h2>
                                    <p>Reviews for this venue will appear here when available.</p>
                                </div>
                            )}
                        </section>

                        {/* Facilities */}
                        <section className="pd-spaces">
                            <h2>Spaces for every moment</h2>
                            <div className="pd-space-grid">
                                {(facilities.length
                                    ? facilities.slice(0, 3)
                                    : ['The Courtyard', 'Celebration Hall', 'Garden & Lawn']
                                ).map((facility, index) => {
                                    const icons = [FaTree, FaLandmark, FaHotel];
                                    const SpaceIcon = icons[index % icons.length];

                                    return (
                                        <div className="pd-space-card" key={`${facility}-${index}`}>
                                            <SpaceIcon />
                                            <div>
                                                <strong>{facility}</strong>
                                                <span>
                                                    {palace.capacity
                                                        ? `Up to ${palace.capacity} guests`
                                                        : 'Special celebrations'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    {/* Booking panel */}
                    <aside className="pd-booking-column" id="pd-booking">
                        <section className="pd-booking-card">
                            <h2>Plan your visit</h2>
                            <p>Tell us a little about your celebration.</p>

                            {error && (
                                <div className="pd-message pd-error" role="alert">
                                    {error}
                                </div>
                            )}

                            {message && (
                                <div className="pd-message pd-success" role="status">
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleBooking}>
                                <label htmlFor="pd-date">Wedding date</label>
                                <div className="pd-input-wrap">
                                    <input
                                        id="pd-date"
                                        type="date"
                                        name="weddingDate"
                                        min={getMinWeddingDate()}
                                        value={form.weddingDate}
                                        onChange={handleChange}
                                        required
                                    />
                                    <FaRegCalendarAlt />
                                </div>

                                <label htmlFor="pd-guests">Guest count</label>
                                <div className="pd-input-wrap">
                                    <input
                                        id="pd-guests"
                                        type="number"
                                        name="guestCount"
                                        min="1"
                                        max={palace.capacity || undefined}
                                        placeholder="e.g. 150 guests"
                                        value={form.guestCount}
                                        onChange={handleChange}
                                        required
                                    />
                                    <FaUsers />
                                </div>

                                <label htmlFor="pd-requests">Special requests</label>
                                <textarea
                                    id="pd-requests"
                                    name="specialRequests"
                                    rows="3"
                                    placeholder="Tell us about your celebration (optional)"
                                    value={form.specialRequests}
                                    onChange={handleChange}
                                />

                                <div className="pd-popular-note">
                                    ✣ Popular dates may fill quickly. Request availability early.
                                </div>

                                <button
                                    className="pd-request-button"
                                    type="submit"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Submitting request…' : 'Request availability'}
                                </button>

                                <button
                                    className="pd-question-button"
                                    type="button"
                                    onClick={() => {
                                        document.getElementById('pd-requests')?.focus();
                                    }}
                                >
                                    Ask a question
                                </button>
                            </form>
                        </section>

                        <p className="pd-verified">
                            <FaShieldAlt />
                            Verified venue · Responses within 24 hours
                        </p>
                    </aside>
                </section>

                {/* More venue information */}
                <section className="pd-more">
                    <h2>A little more from this venue</h2>
                    <div className="pd-more-links">
                        {['Accommodation', 'Dining & menus', 'Getting here'].map((item) => (
                            <button key={item} onClick={() => setActiveTab('Packages')}>
                                {item}
                                <FaArrowRight />
                            </button>
                        ))}
                    </div>
                </section>

                <footer className="pd-footer">
                    VOW & VINE · Thoughtful planning for unforgettable days
                </footer>
            </div>

            {/* Mobile fixed actions */}
            <div className="pd-mobile-actions">
                <button
                    className="pd-mobile-request"
                    onClick={() => {
                        document.getElementById('pd-booking')?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }}
                >
                    Request availability
                </button>
                <button
                    className="pd-mobile-question"
                    onClick={() => {
                        document.getElementById('pd-requests')?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                        document.getElementById('pd-requests')?.focus();
                    }}
                >
                    Ask a question
                </button>
            </div>
        </main>
    );
};
