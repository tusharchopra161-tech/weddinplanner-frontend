import React, { useEffect, useState } from 'react';
import './filtersec.css';
import { FilCards } from '../FilCards';

export const FilterSection = () => {
    const [palaces, setPalaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [destination, setDestination] = useState('Any destination');
    const [guests, setGuests] = useState(200);
    const [budget, setBudget] = useState(500000);
    const [sort, setSort] = useState('Recommended');
    // Fetch all approved palaces from backend
    useEffect(() => {

        const fetchPalaces = async () => {
            try {
                const response = await fetch(
                    'https://weddingplanner-backend.onrender.com/palace'
                    // ||"https://weddingplannerbackend-vaq7.onrender.com/palace"
                );

                const data = await response.json();
                // console.log(data)
                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message || 'Failed to fetch palaces'
                    );
                }
                setPalaces(data.palace || data.palaces || []);
                console.log(palaces)
                
            } catch (err) {
                console.error('Fetch palaces error:', err);
                setError(err.message || 'Unable to load palaces');
            } finally {
                setLoading(false);
            }
        };

        fetchPalaces();
        
    }, []);
   
    // Filter and sort palaces
    const filteredPalaces = palaces
        .filter((palace) => {
            const matchesDestination =
                destination === 'Any destination' ||
                palace.location?.toLowerCase().includes(
                    destination.toLowerCase()
                );

            const matchesGuests =
                Number(palace.capacity) >= guests;

            const matchesBudget =
                Number(palace.price) <= budget;

            return (
                matchesDestination &&
                matchesGuests &&
                matchesBudget
            );
        })
        .sort((a, b) => {
            if (sort === 'Low to high') {
                return Number(a.price) - Number(b.price);
            }

            if (sort === 'High to low') {
                return Number(b.price) - Number(a.price);
            }

            return 0;
        });
    //      useEffect(() => {
    //     const interval = setInterval(() => {
    //         setVisibleCount(filteredPalaces.length);
    //     }, 5000);

    //     return () => clearInterval(interval);
    // }, [filteredPalaces.length]);

    return (
        <div className="fil-main ">

            {/* LEFT FILTER */}
            <div className="fil-result ">

                <div className="flex justify-between items-center">
                    <h3 className="text-[#692065] text-lg font-semibold">
                        Filter results
                    </h3>
                    <span className="text-[#692065] text-sm">
                        ☷
                    </span>
                </div>

                {/* Destination */}
                <div className="flex flex-col gap-2">
                    <label className="text-[#654E63] text-[10px] font-semibold">
                        DESTINATION
                    </label>

                    <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-[90%] h-8 rounded-lg border border-[#DFC9DC] bg-[#FCF6E9] px-2 text-xs text-[#654E63] outline-none"
                    >
                        <option>Any destination</option>
                        <option>Yamunanagar</option>
                        <option>Jagadhri</option>
                        <option>Ambala</option>
                        <option>Radaur</option>
                    </select>
                </div>

                {/* Guest Capacity */}
                <div className="flex flex-col gap-2">
                    <label className="text-[#654E63] text-[10px] font-semibold">
                        GUEST CAPACITY
                    </label>

                    <input
                        type="range"
                        min="200"
                        max="2000"
                        step="100"
                        value={guests}
                        onChange={(e) =>
                            setGuests(Number(e.target.value))
                        }
                        className="w-[90%] accent-[#692065]"
                    />

                    <div className="flex justify-between text-xs text-[#654E63]">
                        <span>200</span>
                        <span>
                            {guests === 2000 ? '2000+' : guests}
                        </span>
                    </div>
                </div>

                {/* Budget */}
                <div className="flex flex-col gap-2">
                    <label className="text-[#654E63] text-[10px] font-semibold">
                        BUDGET
                    </label>

                    <input
                        type="range"
                        min="500000"
                        max="10000000"
                        step="500000"
                        value={budget}
                        onChange={(e) =>
                            setBudget(Number(e.target.value))
                        }
                        className="w-[90%] accent-[#692065]"
                    />

                    <span className="text-xs text-[#654E63]">
                        {budget >= 10000000
                            ? '₹1 Crore+'
                            : `₹${(budget / 100000).toFixed(0)} Lakh`}
                    </span>
                </div>

            </div>

            {/* PALACE RESULTS */}
            <div className="palace-results">

                <div className="palace-results-header">
                    <div>
                        <h2 className="palace-results-title">
                            Palaces for your love story
                        </h2>
                        <p className="text-[#654E63] text-sm">
                            {loading
                                ? 'Loading palaces...'
                                : `${filteredPalaces.length} beautiful venues found`}
                        </p>
                    </div>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="sort-select"
                        aria-label="Sort palaces"
                    >
                        <option>Recommended</option>
                        <option>Low to high</option>
                        <option>High to low</option>
                    </select>
                </div>

                {loading && (
                    <p className="text-[#654E63]">
                        Loading palaces from server...
                    </p>
                )}

                {!loading && error && (
                    <p className="text-red-600">
                        {error}
                    </p>
                )}

                {!loading && !error && filteredPalaces.length === 0 && (
                    <p className="text-[#654E63]">
                        No palaces found. Try changing your filters.
                    </p>
                )}
                {!loading && !error && (
                    <div className="palace-cards-grid">
                        {filteredPalaces.map((palace) => (
                            
                            <FilCards
                                key={palace._id}
                                palaceId={palace._id}
                                image={
                                    palace.Images?.[0] ||
                                    palace.images?.[0] ||
                                    'https://placehold.co/600x400?text=Palace'
                                }
                                name={palace.name}
                                location={palace.location}
                                price={Number(palace.price).toLocaleString('en-IN')}
                                rating={palace.rating}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};