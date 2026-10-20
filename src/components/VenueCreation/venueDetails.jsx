import React from 'react'

export const VenueDetails = ({formData, updateForm, onBack, onContinue, completedDetails})=>{
  const handleSubmit = (event) => {
    event.preventDefault();

    const valid =
      formData.name.trim() &&
      formData.location.trim() &&
      formData.price !== "" &&
      Number(formData.price) >= 0 &&
      formData.capacity !== "" &&
      Number.isInteger(Number(formData.capacity)) &&
      Number(formData.capacity) >= 1 &&
      formData.description.trim();

    if (!valid) return;

    onContinue();
  };

  return (
    <form className="venue-details-form" onSubmit={handleSubmit}>
      <div className="venue-section-heading">
        <div>
          <span className="venue-eyebrow">STEP 1 OF 4</span>
          <h2>Venue details</h2>
          <p>Start with the essentials. You can edit these details anytime.</p>
        </div>

        <span className="venue-field-count">
          {completedDetails}/5 completed
        </span>
      </div>

      <div className="venue-form-grid">
        <label className="venue-field">
          <span>Venue name <b>*</b></span>
          <input
            type="text"
            placeholder="e.g. The Aravali Palace"
            value={formData.name}
            onChange={(e) => updateForm("name", e.target.value)}
            required
          />
        </label>

        <label className="venue-field">
          <span>Venue type <b>*</b></span>
          <select defaultValue="Heritage palace" required>
            <option>Heritage palace</option>
            <option>Banquet hall</option>
            <option>Resort</option>
            <option>Farmhouse</option>
            <option>Hotel</option>
            <option>Garden venue</option>
          </select>
        </label>

        <label className="venue-field venue-field-full">
          <span>Location <b>*</b></span>
          <input
            type="text"
            placeholder="City, state or full address"
            value={formData.location}
            onChange={(e) => updateForm("location", e.target.value)}
            required
          />
        </label>

        <label className="venue-field">
          <span>Guest capacity <b>*</b></span>
          <input
            type="number"
            min="1"
            step="1"
            placeholder="500 guests"
            value={formData.capacity}
            onChange={(e) => updateForm("capacity", e.target.value)}
            required
          />
        </label>

        <label className="venue-field">
          <span>Starting price (₹) <b>*</b></span>
          <input
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 85000"
            value={formData.price}
            onChange={(e) => updateForm("price", e.target.value)}
            required
          />
        </label>

        <label className="venue-field venue-field-full">
          <span>About your venue <b>*</b></span>
          <textarea
            rows="5"
            maxLength={500}
            placeholder="Describe the atmosphere, facilities and what makes your venue special..."
            value={formData.description}
            onChange={(e) => updateForm("description", e.target.value)}
            required
          />
          <small className="venue-character-count">
            {formData.description.length}/500
          </small>
        </label>
      </div>

      <div className="venue-suggestion">
        <strong>Best suited for</strong>
        <div>
          <span>Weddings</span>
          <span>Receptions</span>
          <span>Engagements</span>
          <span>Corporate events</span>
        </div>
      </div>

      <div className="venue-navigation">
        <button
          type="button"
          className="venue-btn venue-btn-back"
          onClick={onBack}
          disabled
        >
          Back
        </button>

        <button type="submit" className="venue-btn venue-btn-primary">
          Save & Continue →
        </button>
      </div>
    </form>
  )
}
