import React from 'react'
import { StartPLannigSearch } from '../../components/StartPlannigSearch'
import { FilterSection } from '../../components/FilterSection'
import './palace.css'
export const Palaces = () => {
  return (
    <div className=" min-h-screen relative bg-[#FCF6E9] text-black ">
        <div className="palace1 h-[65vh] flex flex-col gap-4">
            <h4 className='text-[#C28D2E] text-2xl'>EXPLORE UNFORGETTABLE PALACES</h4>
            <h1 className='text-[#692065] text-5xl'>Find your perfect palace</h1>
            <p className='text-[#654E63] text-2xl'>
                Discover beatiful venues for every kind of celebation, from grand historic<br/> estates to intimate hidden gems.
            </p>
        </div>
            <StartPLannigSearch/>
            <FilterSection/>
        </div>
  )
}
