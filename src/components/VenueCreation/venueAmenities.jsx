import React from 'react'
import { useState } from "react";

const amenityOptions = [
  { name: "Parking", icon: "🚗", description: "Dedicated parking for guests" },
  { name: "Catering", icon: "🍽️", description: "Food and dining services" },
  { name: "Decoration", icon: "🌸", description: "Wedding stage and floral decor" },
  { name: "DJ and Music", icon: "🎵", description: "Music system and DJ services" },
  { name: "Garden", icon: "🌿", description: "Outdoor garden and lawn" },
  { name: "Guest Rooms", icon: "🛏️", description: "Rooms for family and guests" },
  { name: "Air Conditioning", icon: "❄️", description: "Air-conditioned event spaces" },
  { name: "Power Backup", icon: "⚡", description: "Backup electricity supply" },
  { name: "Photography", icon: "📸", description: "Photography facilities or services" },
  { name: "Security", icon: "🛡️", description: "Security for your event" },
  { name: "Bridal Suite", icon: "💍", description: "Private room for the bride" },
  { name: "Indoor Hall", icon: "🏛️", description: "Indoor function space" },
];
export const VenueAmenities = ({
  formData,
  updateForm,
  onBack,
  onContinue, 
}) => {
  const [error, setError] = useState("");

const selectedFacilities = formData.facilities || [];

const toggleAmenity = (amenityName) => {
const updatedFacilities = selectedFacilities.includes(amenityName)
? selectedFacilities.filter((item) => item !== amenityName)
: [...selectedFacilities, amenityName];

updateForm("facilities", updatedFacilities);
setError("");

};

const handleContinue = () => {
if (selectedFacilities.length === 0) {
setError("Please select at least one amenity to continue.");
return;
}

setError("");
onContinue();

};

return (
<div className="venue-amenities-step">
<div className="venue-section-heading">
<div>
<span className="venue-eyebrow">STEP 3 OF 4</span>
<h2>Make your venue stand out</h2>
<p>
Select the amenities and facilities available at your palace
so couples can find the perfect venue for their celebration.
</p>
</div>

    <span className="venue-field-count">
      {selectedFacilities.length} selected
    </span>
  </div>

  <div className="venue-amenities-intro">
    <strong>What does your venue offer?</strong>
    <span>Select all that apply to your property.</span>
  </div>

  <div className="venue-amenities-grid">
    {amenityOptions.map((amenity) => {
      const isSelected = selectedFacilities.includes(amenity.name);

      return (
        <button
          type="button"
          key={amenity.name}
          className={`venue-amenity-option ${
            isSelected ? "selected" : ""
          }`}
          onClick={() => toggleAmenity(amenity.name)}
          aria-pressed={isSelected}
        >
          <span className="venue-amenity-icon">{amenity.icon}</span>

          <span className="venue-amenity-copy">
            <strong>{amenity.name}</strong>
            <small>{amenity.description}</small>
          </span>

          <span className="venue-amenity-check">
            {isSelected ? "✓" : "+"}
          </span>
        </button>
      );
    })}
  </div>

  {error && (
    <p className="venue-amenities-error" role="alert">
      {error}
    </p>
  )}

  <div className="venue-amenities-summary">
    <div>
      <strong>Your selected amenities</strong>
      <p>
        {selectedFacilities.length > 0
          ? selectedFacilities.join(" · ")
          : "No amenities selected yet"}
      </p>
    </div>

    <span>{selectedFacilities.length} selected</span>
  </div>

  <div className="venue-navigation">
    <button
      type="button"
      className="venue-btn venue-btn-back"
      onClick={onBack}
    >
      ← Back
    </button>

    <button
      type="button"
      className="venue-btn venue-btn-primary"
      onClick={handleContinue}
    >
      Save & Continue →
    </button>
  </div>
</div>

);
  
}
