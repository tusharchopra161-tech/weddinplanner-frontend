import React, { useState, useEffect } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    useMap,
    AttributionControl
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./locationPicker.css";

const palaceIcon = L.divIcon({
    className: "palace-map-marker",
    html: `<div class="palace-marker-pin"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
});

const MapClickHandler = ({ onSelect }) => {
    useMapEvents({
        click(event) {
            onSelect({
                latitude: event.latlng.lat,
                longitude: event.latlng.lng,
            });
        },
    });

    return null;
};

const RecenterMap = ({ coordinates }) => {
    const map = useMap();

    useEffect(() => {
        if (coordinates) {
            map.flyTo(
                [coordinates.latitude, coordinates.longitude],
                17
            );
        }
    }, [coordinates, map]);

    return null;
};

export const LocationPicker = ({
    address,
    coordinates,
    onAddressChange,
    onCoordinatesChange,
}) => {
    const [loading, setLoading] = useState(false);
    const [locating, setLocating] = useState(false);
    const [error, setError] = useState("");

    // Get owner's current GPS location
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }

        setLocating(true);
        setError("");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const currentCoordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };

                onCoordinatesChange(currentCoordinates);
                setLocating(false);
            },
            (err) => {
                setLocating(false);

                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError(
                            "Location permission denied. Please allow location access in your browser."
                        );
                        break;

                    case err.POSITION_UNAVAILABLE:
                        setError("Your current location is unavailable.");
                        break;

                    case err.TIMEOUT:
                        setError("Location request timed out. Please try again.");
                        break;

                    default:
                        setError("Unable to detect your current location.");
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    };

    // Automatically detect owner's location when the component opens.
    // Do not overwrite coordinates already selected by the owner.
    useEffect(() => {
        if (!coordinates) {
            getCurrentLocation();
        }
    }, []);

    const findLocation = async () => {
        if (!address.trim()) {
            setError("Please enter the palace address first.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(address)}`
            );

            if (!response.ok) {
                throw new Error("Unable to search this address.");
            }

            const results = await response.json();

            if (!results.length) {
                setError("Location not found. Try a more complete address.");
                return;
            }

            const place = results[0];

            onAddressChange(place.display_name);

            onCoordinatesChange({
                latitude: Number(place.lat),
                longitude: Number(place.lon),
            });
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const updateMarker = (position) => {
        onCoordinatesChange(position);
        setError("");
    };

    return (
        <div className="location-picker">
            <label className="venue-field">
                <span>Palace address <b>*</b></span>

                <input
                    type="text"
                    placeholder="Enter palace name, city, state or full address"
                    value={address}
                    onChange={(e) => {
                        onAddressChange(e.target.value);
                        onCoordinatesChange(null);
                    }}
                />
            </label>

            <button
                type="button"
                className="venue-btn venue-btn-primary location-search-btn"
                onClick={findLocation}
                disabled={loading}
            >
                {loading ? "Searching..." : "Find on Map"}
            </button>

            <button
                type="button"
                className="venue-btn venue-btn-back"
                onClick={getCurrentLocation}
                disabled={locating}
            >
                {locating ? "Detecting location..." : "◎ Use My Current Location"}
            </button>

            {error && (
                <p className="location-error">{error}</p>
            )}

            <p className="location-map-help">
                Your current location is selected initially. Drag the marker
                or click on the map to choose the exact palace entrance.
            </p>

            {locating && !coordinates && (
                <div className="location-loading">
                    Detecting your current location...
                </div>
            )}

            {coordinates ? (
                <div className="location-map-container">
                    <MapContainer
                        center={[
                            coordinates.latitude,
                            coordinates.longitude,
                        ]}
                        zoom={20}
                        scrollWheelZoom
                        className="location-map"

                        attributionControl={false}
                    >
                        <AttributionControl prefix="The Chopra's Map Company" position="bottomright" />

                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <MapClickHandler onSelect={updateMarker} />

                        <RecenterMap coordinates={coordinates} />

                        <Marker
                            position={[
                                coordinates.latitude,
                                coordinates.longitude,
                            ]}
                            icon={palaceIcon}
                            draggable
                            eventHandlers={{
                                dragend: (event) => {
                                    const position = event.target.getLatLng();

                                    updateMarker({
                                        latitude: position.lat,
                                        longitude: position.lng,
                                    });
                                },
                            }}
                        />
                    </MapContainer>
                </div>
            ) : (
                !locating && (
                    <div className="location-loading">
                        Please detect your location or search for your palace address
                        to display the map.
                    </div>
                )
            )}

            {coordinates && (
                <div className="location-coordinates">
                    <strong>✓ Palace location selected</strong>

                    <span>
                        Latitude: {coordinates.latitude.toFixed(6)}
                    </span>

                    <span>
                        Longitude: {coordinates.longitude.toFixed(6)}
                    </span>
                </div>
            )}
        </div>
    );
};