import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaUsers,
    FaArrowLeft
} from 'react-icons/fa';
import './myBookings.css';

const API_URL = 'https://weddingplanner-backend.onrender.com';

export const MyBookings = () => {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                setError('');

                const currentUser = JSON.parse(
                    localStorage.getItem('currentUser') || 'null'
                );

                const token =localStorage.getItem('token')

                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await fetch(`${API_URL}/booking/my`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || 'Unable to load your bookings.'
                    );
                }

                const bookingList = Array.isArray(data)
                    ? data
                    : data.bookings || data.data || [];

                setBookings(bookingList);
            } catch (err) {
                setError(err.message || 'Something went wrong.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [navigate]);

    const formatDate = (date) => {
        if (!date) return 'Date not selected';

        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
                return 'booking-status confirmed';
            case 'rejected':
                return 'booking-status rejected';
            case 'cancelled':
                return 'booking-status cancelled';
            default:
                return 'booking-status pending';
        }
    };

    if (loading) {
        return (
            <div className="my-bookings-state">
                <div className="booking-loader" />
                <p>Loading your bookings...</p>
            </div>
        );
    }

    return (
        <main className="my-bookings-page">
            <button
                className="booking-back-button"
                onClick={() => navigate('/palaces')}
            >
                <FaArrowLeft /> Explore palaces
            </button>

            <section className="my-bookings-heading">
                <span className="booking-eyebrow">YOUR CELEBRATION JOURNEY</span>
                <h1>My Bookings</h1>
                <p>Keep track of your wedding venue requests in one place.</p>
            </section>

            {error && (
                <div className="booking-error" role="alert">
                    {error}
                </div>
            )}

            {!error && bookings.length === 0 ? (
                <section className="booking-empty">
                    <FaCalendarAlt className="booking-empty-icon" />
                    <h2>No bookings yet</h2>
                    <p>
                        Your wedding journey starts with finding the perfect
                        venue. Your booking requests will appear here.
                    </p>
                    <button onClick={() => navigate('/palaces')}>
                        Explore venues
                    </button>
                </section>
            ) : (
                <section className="booking-list">
                    {bookings.map((booking) => {
                        const palace =
                            booking.palace &&
                            typeof booking.palace === 'object'
                                ? booking.palace
                                : {};

                        const imageItem =
                            palace.Images?.[0] || palace.images?.[0];

                        const image =
                            typeof imageItem === 'string'
                                ? imageItem
                                : imageItem?.url || palace.image || '';

                        const status =
                            booking.bookingStatus || 'pending';

                        return (
                            <article
                                className="booking-card"
                                key={booking._id}
                            >
                                <div className="booking-card-image">
                                    {image ? (
                                        <img
                                            src={image}
                                            alt={palace.name || 'Wedding venue'}
                                        />
                                    ) : (
                                        <FaCalendarAlt />
                                    )}
                                </div>

                                <div className="booking-card-content">
                                    <div className="booking-card-top">
                                        <div>
                                            <h2>
                                                {palace.name ||
                                                    'Wedding venue'}
                                            </h2>

                                            <p className="booking-location">
                                                <FaMapMarkerAlt />
                                                {palace.location ||
                                                    'Location unavailable'}
                                            </p>
                                        </div>

                                        <span className={getStatusClass(status)}>
                                            {status}
                                        </span>
                                    </div>

                                    <div className="booking-details">
                                        <div>
                                            <FaCalendarAlt />
                                            <span>
                                                <small>Wedding date</small>
                                                <strong>
                                                    {formatDate(
                                                        booking.weddingDate
                                                    )}
                                                </strong>
                                            </span>
                                        </div>

                                        <div>
                                            <FaUsers />
                                            <span>
                                                <small>Guests</small>
                                                <strong>
                                                    {booking.guestCount ?? '—'}
                                                </strong>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="booking-card-bottom">
                                        <p>
                                            Estimated price:{' '}
                                            <strong>
                                                ₹
                                                {Number(
                                                    booking.totalPrice || 0
                                                ).toLocaleString('en-IN')}
                                            </strong>
                                        </p>

                                        <span className="booking-payment">
                                            Payment:{' '}
                                            {booking.paymentStatus || 'Pending'}
                                        </span>
                                    </div>

                                    {booking.specialRequests && (
                                        <p className="booking-requests">
                                            <strong>Special requests:</strong>{' '}
                                            {booking.specialRequests}
                                        </p>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </section>
            )}
        </main>
    );
};
