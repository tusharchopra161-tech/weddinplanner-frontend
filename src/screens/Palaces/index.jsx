
import React from 'react'
import { StartPLannigSearch } from '../../components/StartPlannigSearch'
import { FilterSection } from '../../components/FilterSection'
import './palace.css'

export const Palaces = () => {
  return (
    <main className="palaces-page">

      {/* Hero Section */}
      <section className="palace1">
        <h4>EXPLORE UNFORGETTABLE PALACES</h4>

        <h1>Find your perfect palace</h1>

        <p>
          Discover beautiful venues for every kind of celebration,
          from grand historic estates to intimate hidden gems.
        </p>
      </section>

      {/* Existing Search Component — Design Unchanged */}
      <div className="palace-search-wrapper">
        <StartPLannigSearch />
      </div>

      {/* Palace Filters and Results */}
      <FilterSection />
    </main>
  )
}
