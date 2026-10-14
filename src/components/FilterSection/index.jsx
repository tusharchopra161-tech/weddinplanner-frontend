import React, { useState } from 'react'
import { Cards } from '../Cards';
import './filtersec.css'
import { FilCards } from '../FilCards';
// import { FilCards } from '../FilCards/index.jsx';
export const FilterSection = () => {
    const [guests, setGuests] = useState(200);
    const [budget, setBudget] = useState(500000);

    return (
        <div className="fil-main w-full flex gap-5">

            {/* LEFT FILTER */}
            <div className="fil-result w-[20%] min-h-[45vh] rounded-2xl border-2 border-[#DFC9DC] bg-[#FFFDF8] flex flex-col gap-4">

                <div className="flex justify-between  items-center">
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

                    <select className="w-[70%] h-8 rounded-lg border border-[#DFC9DC] bg-[#FCF6E9] px-2 text-xs text-[#654E63] outline-none">
                        <option>Any destination</option>
                        <option>Yamuna Nagar</option>
                        <option>Jagadhri</option>
                        <option>Ambala Road</option>
                        <option>Rador</option>
                    </select>
                </div>


                <div className="flex flex-col gap-2">
                    <label className="text-[#654E63] text-[10px] font-semibold">
                        WEDDING STYLE
                    </label>

                    <select className="w-[70%] h-8 rounded-lg border border-[#DFC9DC] bg-[#FCF6E9] px-2 text-xs text-[#654E63] outline-none">
                        <option>Any style</option>
                        <option>Traditional Wedding</option>
                        <option>Destination Wedding</option>
                        <option>Beach Wedding</option>
                        <option>Royal Wedding</option>
                        <option>Garden Wedding</option>
                    </select>
                </div>


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
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-[90%] accent-[#692065]"
                    />

                    <div className="flex justify-between text-xs text-[#654E63]">
                        <span>200</span>
                        <span>
                            {guests === 2000 ? "2000+" : guests}
                        </span>
                    </div>
                </div>


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
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="w-[90%] accent-[#692065]"
                    />

                    <span className="text-xs text-[#654E63]">
                        {budget >= 10000000
                            ? "₹1 Crore+"
                            : `₹${(budget / 100000).toFixed(0)} Lakh`}
                    </span>
                </div>

            </div>



            <div className="w-[75%] flex flex-col gap-3">
                <div className="flex justify-between items-start mb-5">

                    <div>
                        <h2 className="text-[#692065] text-[2rem] font-semibold">
                            Palaces for your love story
                        </h2>

                        <p className="text-[#654E63] text-sm">
                            6 beautiful venues waiting to be discovered
                        </p>
                    </div>

                    <select className="w-[140px] h-10 rounded-lg border border-[#DFC9DC] bg-white px-2 text-lg text-[#654E63] outline-none">
                        <option>Recommended</option>
                        <option>Low to high</option>
                        <option>High to low</option>
                    </select>

                </div>
                <div className="grid grid-cols-3 gap-3">

                     <FilCards image="YOUR_IMAGE_URL"
                        name="The Rosewood Palace"
                        location="Lake Como, Italy"
                        price="8,500"
                        rating="4.9" /> 
                        <FilCards image="YOUR_IMAGE_URL"
                        name="The Rosewood Palace"
                        location="Lake Como, Italy"
                        price="8,500"
                        rating="4.9" />
                        <FilCards
        image="YOUR_IMAGE_URL"
        name="The Grand Regent"
        location="London, England"
        price="11,500"
        rating="4.9"
    />

    <FilCards
        image="YOUR_IMAGE_URL"
        name="Villa Bellavista"
        location="Tuscany, Italy"
        price="7,800"
        rating="4.8"
    />

    <FilCards
        image="YOUR_IMAGE_URL"
        name="Maison de Fleur"
        location="Bordeaux, France"
        price="10,400"
        rating="4.7"
    />

    <FilCards
        image="YOUR_IMAGE_URL"
        name="The Willow Estate"
        location="Cotswolds, England"
        price="12,800"
        rating="4.8"
    />
                </div>
            </div>
        </div>
    )
}
