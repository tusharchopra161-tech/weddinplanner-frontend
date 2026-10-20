import React from 'react'
import { useState,useRef } from 'react'
export const PhotoShowcase = ({ formData,
  updateForm,
  onBack,
  onContinue,
}) => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");

  const images = formData.Images || [];
  const MIN_IMAGES = 5;
  const MAX_SIZE = 10 * 1024 * 1024;

  const addImages = (files) => {
    setError("");

    const selectedFiles = Array.from(files || []);
    const validFiles = [];
    const errors = [];

    selectedFiles.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        errors.push(`${file.name} is not an image.`);
        return;
      }

      if (file.size > MAX_SIZE) {
        errors.push(`${file.name} exceeds the 10 MB limit.`);
        return;
      }

      validFiles.push(file);
    });

    const remaining = Math.max(0, 10 - images.length);
    const filesToAdd = validFiles.slice(0, remaining);

    if (validFiles.length > remaining) {
      errors.push("You can add a maximum of 10 photos.");
    }

    if (filesToAdd.length > 0) {
      const newImages = filesToAdd.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      updateForm("Images", [...images, ...newImages]);
    }

    setError(errors.join(" "));
  };

  const removeImage = (index) => {
    const image = images[index];

    if (image?.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(image.preview);
    }

    updateForm(
      "Images",
      images.filter((_, imageIndex) => imageIndex !== index)
    );
    setError("");
  };

  const handleContinue = () => {
    if (images.length < MIN_IMAGES) {
      setError("Please upload at least 5 photos before continuing.");
      return;
    }

    onContinue();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    addImages(event.dataTransfer.files);
  };

  return (
    <div className="venue-photo-step">
      <div className="venue-section-heading">
        <div>
          <span className="venue-eyebrow">STEP 2 OF 4</span>
          <h2>Showcase your venue</h2>
          <p>
            Add beautiful photos so couples can imagine their celebration
            at your palace.
          </p>
        </div>

        <span className="venue-field-count">
          {Math.min(images.length, MIN_IMAGES)}/{MIN_IMAGES} required
        </span>
      </div>

      <div
        className="venue-photo-dropzone"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="venue-photo-upload-icon">↑</div>

        <h3>Drag and drop your photos here</h3>
        <p>or choose images from your device</p>

        <button
          type="button"
          className="venue-btn venue-btn-primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length >= 10}
        >
          Choose photos
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => {
            addImages(event.target.files);
            event.target.value = "";
          }}
        />

        <small>JPG, PNG, WEBP · Maximum 10 MB per photo · Up to 10 photos</small>
      </div>

      {error && (
        <p className="venue-photo-error" role="alert">
          {error}
        </p>
      )}

      <div className="venue-photo-progress">
        <div className="venue-photo-progress-copy">
          <strong>Your photo collection</strong>
          <span>{images.length}/10 photos</span>
        </div>

        <div className="venue-progress-track">
          <div
            className="venue-progress-fill"
            style={{
              width: `${Math.min((images.length / MIN_IMAGES) * 100, 100)}%`,
            }}
          />
        </div>

        <p>
          {images.length >= MIN_IMAGES
            ? "Great! You have added the minimum required photos."
            : `Add ${MIN_IMAGES - images.length} more photo(s) to continue.`}
        </p>
      </div>

      {images.length > 0 && (
        <div className="venue-photo-grid">
          {images.map((image, index) => (
            <div className="venue-photo-item" key={`${image.preview}-${index}`}>
              <img src={image.preview} alt={`Venue preview ${index + 1}`} />

              <button
                type="button"
                className="venue-photo-remove"
                aria-label={`Remove photo ${index + 1}`}
                onClick={() => removeImage(index)}
              >
                ×
              </button>

              <span>Photo {index + 1}</span>
            </div>
          ))}
        </div>
      )}

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
