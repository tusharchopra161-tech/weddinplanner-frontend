
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Polyline,
    Marker,
    useMap,
    AttributionControl
} from 'react-leaflet';
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
    FaBars,
    FaChevronLeft,
    FaChevronRight
} from 'react-icons/fa';
import { IoMdArrowRoundBack } from "react-icons/io";
import './palaceDetails.css';
import WeddingDateCalendar from '../../components/WeddingDateCalendar';

const API_URL = 'https://weddingplanner-backend.onrender.com';


const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const earthRadius = 6371000;

    const toRadians = (value) => (value * Math.PI) / 180;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;

    return earthRadius * 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );
};

const formatDistance = (meters) => {
    if (meters < 1000) {
        return `${Math.round(meters)} m`;
    }

    return `${(meters / 1000).toFixed(1)} km`;
};

const formatDuration = (seconds) => {
    const minutes = Math.ceil(seconds / 60);

    if (minutes < 60) {
        return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return remainingMinutes
        ? `${hours} hr ${remainingMinutes} min`
        : `${hours} hr`;
};

const MapUpdater = ({ position, destination, routeCoordinates }) => {
    const map = useMap();
    const hasFittedInitialBounds = useRef(false);
    const hasFittedRoute = useRef(false);

    const destinationLat = destination?.[0];
    const destinationLng = destination?.[1];

    useEffect(() => {
        if (!position || destinationLat == null || destinationLng == null) {
            return;
        }

        // Initially show both the current location and destination.
        if (!hasFittedInitialBounds.current) {
            map.fitBounds([position, destination], {
                padding: [45, 45],
                maxZoom: 19
            });

            hasFittedInitialBounds.current = true;
        }

        // Once the driving route arrives, fit the complete route once.
        if (routeCoordinates?.length > 1 && !hasFittedRoute.current) {
            const bounds = L.latLngBounds([position, destination]);

            routeCoordinates.forEach((point) => {
                bounds.extend(point);
            });

            map.fitBounds(bounds, {
                padding: [45, 45],
                maxZoom: 19
            });

            hasFittedRoute.current = true;
        }
    }, [map, destinationLat, destinationLng, routeCoordinates]);

    return null;
};

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
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [journeyStatus, setJourneyStatus] = useState('idle');
    const [currentPosition, setCurrentPosition] = useState(null);
    const [gpsError, setGpsError] = useState('');
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [routeInfo, setRouteInfo] = useState(null);
    const [routeLoading, setRouteLoading] = useState(false);
    const [routeError, setRouteError] = useState('');
    const [arrivalMessage, setArrivalMessage] = useState('');
    const [compassHeading, setCompassHeading] = useState(null);
    const [compassEnabled, setCompassEnabled] = useState(false);
    const arrivalCountRef = useRef(0);
    const routeRequestRef = useRef({
        time: 0,
        latitude: null,
        longitude: null
    });
    const [arrivalNotificationStatus, setArrivalNotificationStatus] = useState('');
    const journeyIdRef = useRef(null);
    const arrivalRequestSentRef = useRef(false);
    const routeInProgressRef = useRef(false);
    const watchIdRef = useRef(null);
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
    useEffect(() => {
        if (!compassEnabled || journeyStatus !== 'tracking') {
            return;
        }

        const handleDeviceOrientation = (event) => {
            let heading = null;

            // iPhone Safari
            if (typeof event.webkitCompassHeading === 'number') {
                heading = event.webkitCompassHeading;
            }

            // Android devices
            else if (
                typeof event.alpha === 'number') {
                heading = (360 - event.alpha) % 360;
            }

            if (heading !== null) {
                const screenAngle =
                    window.screen?.orientation?.angle ??
                    window.orientation ??
                    0;

                heading = (heading + screenAngle + 360) % 360;

                setCompassHeading(Math.round(heading));
            }
        };

        window.addEventListener(
            'deviceorientation',
            handleDeviceOrientation,
            true
        );

        return () => {
            window.removeEventListener(
                'deviceorientation',
                handleDeviceOrientation,
                true
            );
        };
    }, [compassEnabled, journeyStatus]);
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

        if (!Number.isInteger(guests) || guests < 100) {
            setError('The minimum guest count must be 100.');
            return;
        }

        if (Number(palace.capacity) > 0 && guests > Number(palace.capacity)) {
            setError(
                `This venue can accommodate up to ${palace.capacity} guests.`
            );
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
            navigate("/my-bookings")
        } catch (err) {
            setError(err.message || 'Unable to submit your request.');
        } finally {
            setSubmitting(false);
        }
    };
    const showPreviousImage = () => {
        setActiveImageIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };
    const showNextImage = () => {
        setActiveImageIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };
    const hasValidCoordinates = () => {
        const latitude = palace?.coordinates?.latitude;
        const longitude = palace?.coordinates?.longitude;

        return (
            latitude !== null &&
            latitude !== undefined &&
            longitude !== null &&
            longitude !== undefined &&
            Number.isFinite(Number(latitude)) &&
            Number.isFinite(Number(longitude)) &&
            Number(latitude) >= -90 &&
            Number(latitude) <= 90 &&
            Number(longitude) >= -180 &&
            Number(longitude) <= 180
        );
    };

    const sendArrivalNotification = async (journeyId) => {
        try {
            const token = localStorage.getItem('token');
            console.log("Arrival API called");
            const response = await fetch(`${API_URL}/journey-arrival`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    palaceId: palace._id,
                    journeyId
                })
            });

            const data = await response.json();

            console.log("Arrival API response:", response.status, data);
            if (!response.ok) {
                throw new Error(
                    data.message || 'Unable to send arrival notification.'
                );
            }

            if (data.notificationSent) {
                setArrivalNotificationStatus(
                    'Arrival push notification sent successfully!'
                );
            } else {
                setArrivalNotificationStatus(
                    data.message || 'Arrival recorded, but push notification was not delivered.'
                );
            }
        } catch (error) {
            console.error('Arrival notification error:', error);

            setArrivalNotificationStatus(
                error.message || 'Unable to send arrival notification.'
            );
        }
    };
    const requestCompassPermission = async () => {
        const OrientationEvent = window.DeviceOrientationEvent;

        if (
            OrientationEvent &&
            typeof OrientationEvent.requestPermission === 'function'
        ) {
            try {
                const permission = await OrientationEvent.requestPermission();
                setCompassEnabled(permission === 'granted');
            } catch (error) {
                console.error('Compass permission error:', error);
                setCompassEnabled(false);
            }
        } else {
            // Browsers that do not require an explicit permission request.
            setCompassEnabled(true);
        }
    };
    const startJourney = async () => {
        setGpsError('');
        setArrivalMessage('');
        setRouteCoordinates([]);
        setRouteInfo(null);
        setRouteError('');

        arrivalCountRef.current = 0;
        arrivalRequestSentRef.current = false;
        journeyIdRef.current = null;
        setArrivalNotificationStatus('');
        routeRequestRef.current = {
            time: 0,
            latitude: null,
            longitude: null
        };
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
            setGpsError('Only customer accounts can start a journey.');
            return;
        }

        if (!hasValidCoordinates()) {
            setGpsError('The destination location is not available for this palace yet.');
            return;
        }

        if (!navigator.geolocation) {
            setGpsError('Your browser does not support GPS location tracking.');
            return;
        }

        if (watchIdRef.current !== null) {
            return;
        }

        // Generate a unique ID for this journey.
        journeyIdRef.current =
            window.crypto?.randomUUID?.() ||
            `${Date.now()}-${Math.random().toString(36).slice(2)}`;

        setJourneyStatus('starting');

        setJourneyStatus('starting');
        setCompassHeading(null);
        await requestCompassPermission();
        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const accuracy = position.coords.accuracy;

                setCurrentPosition({
                    latitude,
                    longitude,
                    accuracy
                });

                setJourneyStatus('tracking');
                setGpsError('');

                const destinationLatitude = Number(palace.coordinates.latitude);
                const destinationLongitude = Number(palace.coordinates.longitude);

                const distance = calculateDistance(
                    latitude,
                    longitude,
                    destinationLatitude,
                    destinationLongitude
                );
                console.log("GPS CHECK", { distance, accuracy, arrivalCount: arrivalCountRef.current })
                // Require two consecutive GPS readings within 1 metre.
                if (accuracy <= 25 && distance <= 10) {
                    arrivalCountRef.current += 1;
                } else {
                    arrivalCountRef.current = 0;
                }

                if (arrivalCountRef.current >= 2) {
                    console.log("DESTINATION REACHED!");
                    console.log("SENDING ARRIVAL REQUEST:", journeyIdRef.current);
                    // Prevent duplicate arrival requests.
                    arrivalRequestSentRef.current = true;

                    setJourneyStatus('arrived');

                    setArrivalMessage(
                        `You have arrived at ${palace.name}!`
                    );

                    setArrivalNotificationStatus('Sending arrival notification...');

                    // Stop GPS tracking after arrival.
                    if (watchIdRef.current !== null) {
                        navigator.geolocation.clearWatch(watchIdRef.current);
                        watchIdRef.current = null;
                    }

                    // Notify the backend.
                    sendArrivalNotification(journeyIdRef.current);
                }

            },
            (error) => {
                const messages = {
                    1: 'Location permission denied. Please allow location access in your browser.',
                    2: 'Your current location is unavailable. Please try again.',
                    3: 'Getting your location timed out. Please try again.'
                };

                setGpsError(messages[error.code] || 'Unable to access your location.');
                setJourneyStatus('error');

                if (watchIdRef.current !== null) {
                    navigator.geolocation.clearWatch(watchIdRef.current);
                    watchIdRef.current = null;
                }
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 15000
            }
        );
    };

    const stopJourney = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }

        arrivalCountRef.current = 0;
        arrivalRequestSentRef.current = false;
        journeyIdRef.current = null;
        setArrivalNotificationStatus('');
        routeRequestRef.current = {
            time: 0,
            latitude: null,
            longitude: null
        };

        setJourneyStatus('idle');
        setCurrentPosition(null);
        setRouteCoordinates([]);
        setRouteInfo(null);
        setRouteError('');
        setArrivalMessage('');
        setGpsError('');
    };

    useEffect(() => {
        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, []);
    useEffect(() => {
        if (!currentPosition || !hasValidCoordinates()) return;

        if (routeInProgressRef.current) return;

        const now = Date.now();
        const previousRequest = routeRequestRef.current;

        // Avoid repeatedly calling the routing service.
        if (now - previousRequest.time < 30000) return;

        const latitude = Number(currentPosition.latitude);
        const longitude = Number(currentPosition.longitude);

        const destinationLatitude = Number(palace.coordinates.latitude);
        const destinationLongitude = Number(palace.coordinates.longitude);

        routeRequestRef.current = {
            time: now,
            latitude,
            longitude
        };

        const fetchRoute = async () => {
            routeInProgressRef.current = true;
            setRouteLoading(true);
            setRouteError('');

            try {
                const url =
                    `https://router.project-osrm.org/route/v1/driving/` +
                    `${longitude},${latitude};` +
                    `${destinationLongitude},${destinationLatitude}` +
                    `?overview=full&geometries=geojson`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Unable to calculate the driving route.');
                }

                const data = await response.json();

                if (data.code !== 'Ok' || !data.routes?.length) {
                    throw new Error('No driving route was found for this destination.');
                }

                const route = data.routes[0];

                const coordinates = route.geometry.coordinates.map(
                    ([routeLongitude, routeLatitude]) => [
                        routeLatitude,
                        routeLongitude
                    ]
                );

                setRouteCoordinates(coordinates);

                setRouteInfo({
                    distance: route.distance,
                    duration: route.duration
                });
            } catch (err) {
                setRouteError(err.message || 'Unable to load the route.');
            } finally {
                routeInProgressRef.current = false;
                setRouteLoading(false);
            }
        };

        fetchRoute();
    }, [
        currentPosition?.latitude,
        currentPosition?.longitude,
        palace
    ]);
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
            {/* <header className="pd-header">
                <button
                    className="pd-mobile-menu"
                    aria-label="Back to palaces"
                    onClick={() => navigate('/palaces')}
                >
                    <IoMdArrowRoundBack />
                </button>

                <button
                    className="pd-brand"
                    onClick={() => navigate('/')}
                    aria-label="Vow and Vine home"
                >
                    {palace.name}
                </button>

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
            </header> */}

            <div className="pd-container">
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
                            <span>
                                {palace.rating
                                    ? 'Guest rating'
                                    : 'Be among the first to visit'}
                            </span>
                        </div>

                        <p className="pd-short-description">
                            {description.length > 170
                                ? `${description.slice(0, 170)}…`
                                : description}
                        </p>
                    </div>

                    <div className="pd-title-side">
                        <div className="pd-header-actions">
                            <button
                                type="button"
                                className={`pd-save-button ${favorite ? 'is-saved' : ''}`}
                                onClick={() => setFavorite((previous) => !previous)}
                                aria-pressed={favorite}
                            >
                                {favorite ? <FaHeart /> : <FaRegHeart />}
                                <span>{favorite ? 'Saved' : 'Save'}</span>
                            </button>
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
                    </div>
                </section>
                {/* Gallery */}
                <section className="pd-main-grid">
                    <div className="pd-left-column">
                        {/* <div className="pd-gallery">
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
                        </div> */}
                        <div className="pd-main-image">
                            {images.length > 0 && (
                                <>
                                    <img
                                        src={images[activeImageIndex]}
                                        alt={`${palace?.name || "Palace"} - Image ${activeImageIndex + 1}`}
                                        className="pd-main-photo"
                                    />

                                    {images.length > 1 && (
                                        <>
                                            <button
                                                type="button"
                                                className="pd-gallery-arrow pd-gallery-prev"
                                                onClick={showPreviousImage}
                                                aria-label="Previous image"
                                            >
                                                <FaChevronLeft />
                                            </button>

                                            <button
                                                type="button"
                                                className="pd-gallery-arrow pd-gallery-next"
                                                onClick={showNextImage}
                                                aria-label="Next image"
                                            >
                                                <FaChevronRight />
                                            </button>

                                            <span className="pd-image-counter">
                                                {activeImageIndex + 1} / {images.length}
                                            </span>
                                        </>
                                    )}
                                </>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="pd-image-thumbnails">
                                {images.map((image, index) => (
                                    <button
                                        type="button"
                                        key={`${image}-${index}`}
                                        className={`pd-thumbnail ${activeImageIndex === index ? "active" : ""
                                            }`}
                                        onClick={() => setActiveImageIndex(index)}
                                        aria-label={`View image ${index + 1}`}
                                    >
                                        <img src={image} alt={`Palace view ${index + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
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
                            <div className="pd-journey-box">
                                <h3>Find your way to this palace</h3>

                                <p>
                                    Start your journey and track your location while travelling
                                    to this wedding destination.
                                </p>

                                {!hasValidCoordinates() && (
                                    <p className="pd-journey-error">
                                        Destination coordinates are not available yet.
                                    </p>
                                )}

                                {gpsError && (
                                    <p className="pd-journey-error" role="alert">
                                        {gpsError}
                                    </p>
                                )}

                                {journeyStatus === 'tracking' && currentPosition && (
                                    <p className="pd-journey-success" role="status">
                                        <span className="pd-live-dot" />
                                        GPS connected · Accuracy approximately{' '}
                                        {Math.round(currentPosition.accuracy)} metres
                                    </p>
                                )}

                                {journeyStatus === 'starting' && (
                                    <p>Waiting for your GPS location...</p>
                                )}

                                {journeyStatus === 'tracking' ? (
                                    <button
                                        type="button"
                                        className="pd-journey-button"
                                        onClick={stopJourney}
                                    >
                                        Stop Journey
                                    </button>
                                ) : journeyStatus === 'arrived' ? (
                                    <button
                                        type="button"
                                        className="pd-journey-button"
                                        disabled
                                    >
                                        You Have Arrived
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="pd-journey-button"
                                        onClick={startJourney}
                                        disabled={
                                            !hasValidCoordinates() ||
                                            journeyStatus === 'starting'
                                        }
                                    >
                                        {journeyStatus === 'starting'
                                            ? 'Getting location...'
                                            : 'Start Your Journey'}
                                    </button>
                                )}
                                {arrivalMessage && (
                                    <div className="pd-journey-success" role="status">
                                        <strong>🎉 {arrivalMessage}</strong>
                                    </div>
                                )}
                                {arrivalNotificationStatus && (
                                    <p className="pd-journey-success" role="status">
                                        {arrivalNotificationStatus}
                                    </p>
                                )}

                                {routeError && (
                                    <p className="pd-journey-error" role="alert">
                                        {routeError}
                                    </p>
                                )}

                                {routeLoading && (
                                    <p className="pd-route-loading">
                                        Calculating your driving route...
                                    </p>
                                )}

                                {currentPosition && (
                                    <div className="pd-navigation">
                                        {routeInfo && (
                                            <div className="pd-route-summary">
                                                <div>
                                                    <span>Distance</span>
                                                    <strong>{formatDistance(routeInfo.distance)}</strong>
                                                </div>

                                                <div>
                                                    <span>Estimated travel time</span>
                                                    <strong>{formatDuration(routeInfo.duration)}</strong>
                                                </div>
                                            </div>
                                        )}

                                        <div className="pd-journey-map">
                                            <MapContainer
                                                attributionControl={false}
                                                center={[
                                                    currentPosition.latitude,
                                                    currentPosition.longitude
                                                ]}
                                                zoom={18}
                                                scrollWheelZoom={true}
                                                style={{ height: '100%', width: '100%' }}
                                            >
                                                <AttributionControl prefix="The Chopra's Map Company" position="bottomright" />
                                                <TileLayer
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />

                                                {compassHeading !== null ? (
                                                    <Marker
                                                        position={[
                                                            currentPosition.latitude,
                                                            currentPosition.longitude
                                                        ]}
                                                        icon={L.divIcon({
                                                            className: '',
                                                            html: `
                                                            <div style="
                                                                width: 40px;
                                                                height: 40px;
                                                                display: flex;
                                                                align-items: center;
                                                                justify-content: center;
                                                                transform: rotate(${compassHeading}deg);
                                                                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
                                                                ">
                                                                    <svg
                                                                        width="36"
                                                                        height="36"
                                                                        viewBox="0 0 40 40"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                            d="M20 2 L35 36 L20 28 L5 36 Z"
                                                                            fill="#2563eb"
                                                                            stroke="white"
                                                                            stroke-width="2"
                                                                            stroke-linejoin="round"
                                                                        />
                                                                    </svg>
                                                            </div>
                                                                `,
                                                            iconSize: [40, 40],
                                                            iconAnchor: [20, 20]
                                                        })}
                                                    />
                                                ) : (
                                                    <CircleMarker
                                                        center={[
                                                            currentPosition.latitude,
                                                            currentPosition.longitude
                                                        ]}
                                                        radius={9}
                                                        pathOptions={{
                                                            color: '#ffffff',
                                                            fillColor: '#2563eb',
                                                            fillOpacity: 1,
                                                            weight: 3
                                                        }}
                                                    />
                                                )}

                                                <CircleMarker
                                                    center={[
                                                        Number(palace.coordinates.latitude),
                                                        Number(palace.coordinates.longitude)
                                                    ]}
                                                    radius={10}
                                                    pathOptions={{
                                                        color: '#ffffff',
                                                        fillColor: '#692065',
                                                        fillOpacity: 1,
                                                        weight: 3
                                                    }}
                                                />

                                                {routeCoordinates.length > 0 && (
                                                    <Polyline
                                                        positions={routeCoordinates}
                                                        pathOptions={{
                                                            color: '#2563eb',
                                                            weight: 6,
                                                            opacity: 0.85
                                                        }}
                                                    />
                                                )}

                                                <MapUpdater
                                                    position={[
                                                        currentPosition.latitude,
                                                        currentPosition.longitude
                                                    ]}
                                                    destination={[
                                                        Number(palace.coordinates.latitude),
                                                        Number(palace.coordinates.longitude)
                                                    ]}
                                                    routeCoordinates={routeCoordinates}
                                                />
                                            </MapContainer>
                                        </div>

                                        <div className="pd-map-legend">
                                            <span>
                                                <i className="pd-current-dot" />
                                                Your location
                                            </span>

                                            <span>
                                                <i className="pd-destination-dot" />
                                                Palace destination
                                            </span>
                                        </div>

                                        <p className="pd-navigation-note">
                                            Blue line shows your driving route. Keep location access enabled
                                            while navigating.
                                        </p>
                                    </div>
                                )}
                            </div>
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
                                <WeddingDateCalendar
                                    palaceId={palaceId}
                                    value={form.weddingDate}
                                    minDate={getMinWeddingDate()}
                                    onChange={(date) =>
                                        setForm((previous) => ({
                                            ...previous,
                                            weddingDate: date,
                                        }))
                                    }
                                />
                                <input
                                    id="pd-date"
                                    type="hidden"
                                    name="weddingDate"
                                    value={form.weddingDate}
                                    required
                                />
                                <label htmlFor="pd-guests">Guest count</label>
                                <div className="pd-input-wrap">
                                    <input
                                        id="pd-guests"
                                        type="number"
                                        name="guestCount"
                                        min={100}
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
