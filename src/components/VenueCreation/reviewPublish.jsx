import React from 'react'
import { useState, useRef } from 'react'
export const ReviewPublish = ({
  formData,
  onBack,
  onEditStep,
  onPublish,
  onCoverSelect,
}) => {
  const [error, setError] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  // Prevents rapid double-clicks before React re-renders.
  const publishingRef = useRef(false);
  const images = formData.Images || [];
  const facilities = formData.facilities || [];

  const validateAndPublish = async () => {
    if (publishingRef.current) return;
    if (
      !formData.name.trim() ||
      !formData.location.trim() ||
      formData.price === "" ||
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) < 0 ||
      formData.capacity === "" ||
      !Number.isInteger(Number(formData.capacity)) ||
      Number(formData.capacity) < 1 ||
      !formData.description.trim()
    ) {
      setError("Please complete all required venue details first.");
      onEditStep(0);
      return;
    }

    if (images.length < 5) {
      setError("Please add at least 5 venue photos.");
      onEditStep(1);
      return;
    }

    if (facilities.length === 0) {
      setError("Please select at least one amenity.");
      onEditStep(2);
      return;
    }
    // Lock immediately, before starting the request.
    publishingRef.current = true;
    setIsPublishing(true);
    setError("");

    try {
      await onPublish();
    } catch (err) {
      setError(err?.message || "Failed to publish your venue. Please try again.");
    } finally {
      publishingRef.current = false;
      setIsPublishing(false);
    }

  };

  return (
    <div className="venue-review-step">
      <div className="venue-section-heading">
        <div>
          <span className="venue-eyebrow">STEP 4 OF 4</span>
          <h2>Review your venue</h2>
          <p>
            Make sure everything looks correct before submitting
            your palace for approval.
          </p>
        </div>

        <span className="venue-field-count">Final review</span>
      </div>

      {error && (
        <p className="venue-review-error" role="alert">
          {error}
        </p>
      )}

      <section className="venue-review-section">
        <div className="venue-review-heading">
          <div>
            <span className="venue-eyebrow">01 · VENUE DETAILS</span>
            <h3>About your venue</h3>
          </div>

          <button
            type="button"
            className="venue-review-edit"
            onClick={() => onEditStep(0)}
          >
            Edit details
          </button>
        </div>

        <div className="venue-review-details">
          <div>
            <small>Venue name</small>
            <strong>{formData.name || "Not provided"}</strong>
          </div>

          <div>
            <small>Location</small>
            <strong>{formData.location || "Not provided"}</strong>
          </div>

          <div>
            <small>Price</small>
            <strong>
              {formData.price !== ""
                ? `₹${Number(formData.price).toLocaleString("en-IN")}`
                : "Not provided"}
            </strong>
          </div>

          <div>
            <small>Guest capacity</small>
            <strong>
              {formData.capacity
                ? `${formData.capacity} guests`
                : "Not provided"}
            </strong>
          </div>

          <div className="venue-review-description">
            <small>Description</small>
            <p>{formData.description || "No description provided."}</p>
          </div>
        </div>
      </section>

      <section className="venue-review-section">
        <div className="venue-review-heading">
          <div>
            <span className="venue-eyebrow">02 · PHOTO SHOWCASE</span>
            <h3>Venue photos</h3>
          </div>

          <button
            type="button"
            className="venue-review-edit"
            onClick={() => onEditStep(1)}
          >
            Edit photos
          </button>
        </div>

        <p className="venue-review-muted">
          {images.length} photo(s) selected. Click a photo to make it your cover.
        </p>

        {images.length > 0 ? (
          <div className="venue-review-photos">
            {images.map((image, index) => {
              const preview =
                typeof image === "string" ? image : image.preview;
              const isCover = index === 0;
              return (
                <button
                  className={`venue-review-photo ${isCover ? "is-cover" : ""}`}
                  key={`${preview}-${index}`}
                  onClick={() => onCoverSelect(index)}
                  aria-label={
                    isCover
                      ? `Photo ${index + 1}, current cover photo`
                      : `Make photo ${index + 1} the cover photo`
                  }
                  aria-pressed={isCover}
                  title={isCover ? "Current cover photo" : "Set as cover"}
                >
                  <img
                    src={preview}
                    alt={`Venue photo ${index + 1}`}
                  />

                  {isCover ? (
                    <span className="venue-review-cover-label">
                      ✓ Cover photo
                    </span>
                  ) : (
                    <span className="venue-review-cover-action">
                      Set as cover
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="venue-review-muted">No photos added yet.</p>
        )}
      </section>

      <section className="venue-review-section">
        <div className="venue-review-heading">
          <div>
            <span className="venue-eyebrow">03 · AMENITIES</span>
            <h3>Facilities available</h3>
          </div>

          <button
            type="button"
            className="venue-review-edit"
            onClick={() => onEditStep(2)}
          >
            Edit amenities
          </button>
        </div>

        {facilities.length > 0 ? (
          <div className="venue-review-facilities">
            {facilities.map((facility) => (
              <span key={facility}>✓ {facility}</span>
            ))}
          </div>
        ) : (
          <p className="venue-review-muted">
            No amenities selected yet.
          </p>
        )}
      </section>

      <div className="venue-review-notice">
        <strong>What happens next?</strong>
        <p>
          After submission is connected, your venue can be sent
          to the admin for review and approval before it becomes
          available to couples.
        </p>
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
          onClick={validateAndPublish}
          disabled={isPublishing}
          aria-busy={isPublishing}
        >
          {isPublishing ? (
            <>
              <span className="venue-publish-spinner" aria-hidden="true" />
              Publishing Venue...
            </>
          ) : (
            "Validate & Publish →"
          )}
        </button>
      </div>
    </div>

  );
}
