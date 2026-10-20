import React from 'react'
import { useState } from 'react';
import { VenueDetails } from './venueDetails'
import './venuecreation.css'
import { PhotoShowcase } from './photoShowcase';
import { VenueAmenities } from './venueAmenities';
import { ReviewPublish } from './reviewPublish';
import { useNavigate } from "react-router-dom";
const steps = [
  "Venue Details",
  "Photo Showcase",
  "Amenities",
  "Review & Publish",
];

const initialForm = {
  name: "",
  location: "",
  price: "",
  capacity: "",
  description: "",
  Images: [],
  facilities: [],
};

export const VenueCreation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [venueForm, setVenueForm] = useState(initialForm);
  const [completedSteps, setCompletedSteps] = useState([]);
  const updateVenueForm = (field, value) => {
    setVenueForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const detailsFields = [
    venueForm.name.trim(),
    venueForm.location.trim(),
    venueForm.price !== "" &&
    Number(venueForm.price) >= 0,
    venueForm.capacity !== "" &&
    Number.isInteger(Number(venueForm.capacity)) &&
    Number(venueForm.capacity) >= 1,
    venueForm.description.trim(),
  ];

  const completedDetails = detailsFields.filter(Boolean).length;

  // Five details fields + five required photos + one or more amenities.
  // Later steps will contribute to this same overall progress indicator.
  const totalRequired = 11;
  const completedCount =
    completedDetails +
    Math.min(venueForm.Images.length, 5) +
    (venueForm.facilities.length > 0 ? 1 : 0);

  const progress = Math.min(
    100,
    Math.round((completedCount / totalRequired) * 100)
  );

  const markStepCompleted = (step) => {
    setCompletedSteps((previous) =>
      previous.includes(step) ? previous : [...previous, step]
    );
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((previous) => previous - 1);
    }
  };

  const saveAndContinue = () => {
    markStepCompleted(currentStep);
    setCurrentStep((previous) => Math.min(previous + 1, 3));
  };

  const handlePublish = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please log in again as a venue owner.");
        return;
      }

      const formData = new FormData();

      formData.append("name", venueForm.name.trim());
      formData.append("location", venueForm.location.trim());
      formData.append("description", venueForm.description.trim());
      formData.append("price", venueForm.price);
      formData.append("capacity", venueForm.capacity);
      formData.append(
        "facilities",
        JSON.stringify(venueForm.facilities)
      );
      formData.append("isAvailable", "true");

      venueForm.Images.forEach((image) => {
        if (image.file) {
          formData.append("Images", image.file);
        }
      });

      const response = await fetch(
        "https://weddingplanner-backend.onrender.com/palace",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to publish venue.");
      }

      // Confirm that the backend returned the created palace.
      const createdPalace = data.palace;

      if (!createdPalace?._id) {
        throw new Error(
          "The palace may have been saved, but the server did not return its ID. Check the backend response."
        );
      }

      alert("Venue submitted successfully for admin approval!");

      // Navigate to the Palace Owner Dashboard.
      navigate("/owner-dashboard", {
        replace: true,
        state: {
          refreshPalace: true,
          palaceId: createdPalace._id,
        },
      });
    } catch (error) {
      console.error("Publish venue error:", error);
      alert(error.message || "Something went wrong.");
    }
  };

  return (
    <div className="venue-workspace">
      <aside className="venue-sidebar">
        <div className="venue-logo">
          <strong>PALACEBOOK</strong>
          <span>VENUE MANAGEMENT</span>
        </div>

        <p className="venue-sidebar-label">MENU</p>

        {["Overview", "My Venues", "Enquiries", "Bookings", "Calendar", "Payments", "Reviews", "Settings"].map(
          (item) => (
            <div
              key={item}
              className={`venue-sidebar-item ${item === "My Venues" ? "selected" : ""
                }`}
            >
              {item}
            </div>
          )
        )}

        <div className="venue-sidebar-profile">
          <span>AR</span>
          <div>
            <strong>Venue Owner</strong>
            <small>Palace Owner</small>
          </div>
        </div>
      </aside>

      <main className="venue-main">
        <div className="venue-topbar">
          <span>My Venues / <strong>Create new venue</strong></span>
          <span className="venue-avatar">AR</span>
        </div>

        <div className="venue-content">
          <div className="venue-page-heading">
            <div>
              <span className="venue-eyebrow">VENUE PROFILE</span>
              <h1>Create your palace venue</h1>
              <p>Tell couples what makes your palace the perfect place to celebrate.</p>
            </div>

            {/* <div className="venue-heading-actions">
              <button
                type="button"
                className="venue-btn venue-btn-back"
                onClick={goBack}
                disabled={currentStep === 0}
              >
                Back
              </button>

              <button
                type="button"
                className="venue-btn venue-btn-primary"
                onClick={() => {
                  if (currentStep === 0) {
                    document
                      .querySelector(".venue-details-form")
                      ?.requestSubmit();
                  } else {
                    saveAndContinue();
                  }
                }}
              >
                {currentStep === 3 ? "Publish venue" : "Save & Continue"}
              </button>
            </div> */}
          </div>

          <div className="venue-progress-summary">
            <div className="venue-progress-copy">
              <span>PROFILE COMPLETION</span>
              <strong>{progress}%</strong>
            </div>
            <div
              className="venue-progress-track"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className="venue-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p>{completedCount} of {totalRequired} required items completed</p>
          </div>

          <div className="venue-stepper">
            {steps.map((step, index) => {
              const completed = completedSteps.includes(index);

              return (
                <button
                  type="button"
                  key={step}
                  className={`venue-step ${index === currentStep ? "active" : ""
                    } ${completed ? "completed" : ""}`}
                  onClick={() => {
                    if (index <= currentStep || completed) {
                      setCurrentStep(index);
                    }
                  }}
                >
                  <span className="venue-step-number">
                    {completed ? "✓" : index + 1}
                  </span>
                  <span>{step}</span>
                </button>
              );
            })}
          </div>

          <div className="venue-layout">
            <section className="venue-card">
              {currentStep === 0 && (
                <VenueDetails
                  formData={venueForm}
                  updateForm={updateVenueForm}
                  onBack={goBack}
                  onContinue={saveAndContinue}
                  completedDetails={completedDetails}
                />
              )}

              {currentStep === 1 && (
                <PhotoShowcase
                  formData={venueForm}
                  updateForm={updateVenueForm}
                  onBack={goBack}
                  onContinue={saveAndContinue}
                />
              )}

              {currentStep === 2 && (
                <VenueAmenities
                  formData={venueForm}
                  updateForm={updateVenueForm}
                  onBack={goBack}
                  onContinue={saveAndContinue}
                />
              )}

              {currentStep === 3 && (
                <ReviewPublish
                  formData={venueForm}
                  onBack={goBack}
                  onEditStep={setCurrentStep}
                  onPublish={handlePublish}
                />
              )}
            </section>

            <aside className="venue-side-panels">
              <section className="venue-card venue-cover-card">
                <h3>Venue cover photo</h3>
                <p>Choose a photo that captures the feeling of your venue.</p>
                <div className="venue-cover-placeholder">
                  <span>＋</span>
                  <small>Photo upload will be available in Step 2</small>
                </div>
                <small>JPG, PNG up to 10 MB</small>
              </section>

              <section className="venue-card venue-checklist">
                <h3>Quick checklist</h3>
                {[
                  ["Venue name added", Boolean(venueForm.name.trim())],
                  ["Location selected", Boolean(venueForm.location.trim())],
                  [
                    "Capacity specified",
                    venueForm.capacity !== "" && Number(venueForm.capacity) >= 1,
                  ],
                  ["Add at least 5 photos", venueForm.Images.length >= 5],
                ].map(([label, done]) => (
                  <div key={label} className={done ? "check-done" : ""}>
                    <span>{done ? "✓" : "○"}</span>
                    {label}
                  </div>
                ))}
              </section>

              <div className="venue-tip">
                ✦ A complete profile gets up to 3× more enquiries from couples.
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
