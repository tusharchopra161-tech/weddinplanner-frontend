import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './startplanningsearch.css'

import { TiLocationOutline } from 'react-icons/ti'
import { SlCalender } from 'react-icons/sl'
import { LuUsers } from 'react-icons/lu'
import { FaSearch } from 'react-icons/fa'

export const StartPLannigSearch = () => {
    const navigate = useNavigate()

    const [location, setLocation] = useState('')
    const [date, setDate] = useState('')
    const [guests, setGuests] = useState('')
    const [error, setError] = useState('')

    const today = new Date().toLocaleDateString('en-CA')

    const handleSearch = (e) => {
        e.preventDefault()

        if (!location.trim()) {
            setError('Please enter a city or region.')
            return
        }

        if (date && date < today) {
            setError('Please select today or a future date.')
            return
        }

        if (guests && Number(guests) < 1) {
            setError('Guest count must be at least 1.')
            return
        }

        setError('')

        const params = new URLSearchParams()
        params.set('location', location.trim())

        if (date) params.set('date', date)
        if (guests) params.set('guests', guests)

        navigate(`/palaces?${params.toString()}`)
    }

    return (
        <section className="start-main">

            <div className="search-heading">
                <span className="search-eyebrow">FIND YOUR PERFECT VENUE</span>

                <h2>Start Planning Your Perfect Day</h2>

                <p>
                    Find a beautiful palace for the celebration of your dreams.
                </p>
            </div>

            <form className="search-form" onSubmit={handleSearch}>

                <div className="search-field">
                    <label htmlFor="search-location">
                        <TiLocationOutline className="s-sign" />
                        Where
                    </label>

                    <input
                        id="search-location"
                        className="s-input"
                        type="text"
                        placeholder="Search city or region"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        autoComplete="off"
                    />
                </div>

                <div className="search-field">
                    <label htmlFor="search-date">
                        <SlCalender className="s-sign" />
                        When
                    </label>

                    <input
                        id="search-date"
                        className="s-input"
                        type="date"
                        min={today}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div className="search-field">
                    <label htmlFor="search-guests">
                        <LuUsers className="s-sign" />
                        Guests
                    </label>

                    <input
                        id="search-guests"
                        className="s-input"
                        type="number"
                        min="1"
                        placeholder="Number of guests"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                    />
                </div>

                <button className="s-btn" type="submit">
                    <FaSearch />
                    <span>Search Palaces</span>
                </button>

            </form>

            {error && (
                <p className="search-error" role="alert">
                    {error}
                </p>
            )}
        </section>
    )
}