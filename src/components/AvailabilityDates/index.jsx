import { useState } from "react";
import "./availabilityDates.css";

export const AvailabilityDates = ({
  bookings = [],
  unavailableDates = [],
  pendingCount = 0,
  availabilitySaving = false,
  onAvailabilityChange,
  money = (amount) => `₹${Number(amount) || 0}`,
  getInitials = (name = "") =>
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "PO",
}) => {
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState("");

  const formatCalendarDate = (dateKey) => {
    if (!dateKey) return "";

    const [year, month, day] = dateKey.split("-").map(Number);

    return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const calendarYear = calendarMonth.getFullYear();
  const calendarMonthIndex = calendarMonth.getMonth();

  const firstWeekday = new Date(
    calendarYear,
    calendarMonthIndex,
    1
  ).getDay();

  const daysInMonth = new Date(
    calendarYear,
    calendarMonthIndex + 1,
    0
  ).getDate();

  const calendarCells = Array.from(
    {
      length: Math.ceil((firstWeekday + daysInMonth) / 7) * 7,
    },
    (_, index) => {
      const day = index - firstWeekday + 1;
      return day >= 1 && day <= daysInMonth ? day : null;
    }
  );

  const moveCalendarMonth = (amount) => {
    setCalendarMonth(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() + amount,
          1
        )
    );
  };

  const selectedDateBookings = bookings.filter(
    (booking) => booking.dateKey === selectedDate
  );

  const selectedDateUnavailable =
    unavailableDates.includes(selectedDate);

  const selectedDateHasBooking = selectedDateBookings.some(
    (booking) => ["Pending", "Confirmed"].includes(booking.status)
  );

  const selectedDateStatus = selectedDateUnavailable
    ? "blocked"
    : selectedDateBookings.some(
        (booking) => booking.status === "Confirmed"
      )
      ? "booked"
      : selectedDateBookings.some(
          (booking) => booking.status === "Pending"
        )
        ? "pending"
        : "available";

  const handleAvailabilityClick = () => {
    if (typeof onAvailabilityChange === "function") {
      onAvailabilityChange(selectedDate);
    }
  };

  return (
    <section className="po-availability-page">
      <div className="po-section-heading">
        <h3>Venue Availability</h3>
        <p>
          Select a date to view client bookings or manage your palace availability.
        </p>
      </div>

      <div className="po-availability-summary">
        <article>
          <span className="po-availability-dot booked" />
          <div>
            <strong>
              {bookings.filter(
                (booking) => booking.status === "Confirmed"
              ).length}
            </strong>
            <small>Confirmed bookings</small>
          </div>
        </article>

        <article>
          <span className="po-availability-dot blocked" />
          <div>
            <strong>{unavailableDates.length}</strong>
            <small>Blocked dates</small>
          </div>
        </article>

        <article>
          <span className="po-availability-dot pending" />
          <div>
            <strong>{pendingCount}</strong>
            <small>Pending requests</small>
          </div>
        </article>
      </div>

      <div className="po-availability-layout">
        <section className="po-panel po-calendar-panel">
          <div className="po-calendar-heading">
            <div>
              <span className="po-eyebrow">YOUR CALENDAR</span>
              <h3>
                {calendarMonth.toLocaleDateString("en-IN", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
            </div>

            <div className="po-calendar-navigation">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => moveCalendarMonth(-1)}
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => moveCalendarMonth(1)}
              >
                ›
              </button>
            </div>
          </div>

          <div className="po-calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day) => (
                <div className="po-calendar-weekday" key={day}>
                  {day}
                </div>
              )
            )}

            {calendarCells.map((day, index) => {
              if (!day) {
                return (
                  <div
                    className="po-calendar-empty"
                    key={`empty-${index}`}
                  />
                );
              }

              const dateKey = [
                calendarYear,
                String(calendarMonthIndex + 1).padStart(2, "0"),
                String(day).padStart(2, "0"),
              ].join("-");

              const dayBookings = bookings.filter(
                (booking) => booking.dateKey === dateKey
              );

              const isBlocked = unavailableDates.includes(dateKey);
              const isBooked = dayBookings.some(
                (booking) => booking.status === "Confirmed"
              );
              const isPending = dayBookings.some(
                (booking) => booking.status === "Pending"
              );

              const dayClass = isBlocked
                ? "blocked"
                : isBooked
                  ? "booked"
                  : isPending
                    ? "pending"
                    : "available";

              return (
                <button
                  type="button"
                  key={dateKey}
                  className={`po-calendar-day ${dayClass} ${
                    selectedDate === dateKey ? "selected" : ""
                  }`}
                  onClick={() => setSelectedDate(dateKey)}
                  aria-pressed={selectedDate === dateKey}
                  aria-label={`${formatCalendarDate(dateKey)}, ${
                    isBlocked
                      ? "unavailable"
                      : isBooked
                        ? "confirmed booking"
                        : isPending
                          ? "pending booking request"
                          : "available"
                  }`}
                >
                  <span>{day}</span>

                  {(isBooked || isPending || isBlocked) && (
                    <span className="po-calendar-indicator" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="po-calendar-legend">
            <span><i className="available" /> Available</span>
            <span><i className="booked" /> Booked</span>
            <span><i className="pending" /> Pending</span>
            <span><i className="blocked" /> Blocked</span>
          </div>
        </section>

        <section className="po-panel po-date-details">
          {!selectedDate ? (
            <div className="po-date-empty">
              <span className="po-date-empty-icon">✦</span>
              <h3>Select a date</h3>
              <p>
                Click any calendar date to view its booking details and availability.
              </p>
            </div>
          ) : (
            <>
              <span className="po-eyebrow">DATE DETAILS</span>
              <h3>{formatCalendarDate(selectedDate)}</h3>

              <span className={`po-date-status ${selectedDateStatus}`}>
                {selectedDateStatus === "blocked"
                  ? "Unavailable"
                  : selectedDateStatus === "booked"
                    ? "Confirmed booking"
                    : selectedDateStatus === "pending"
                      ? "Pending request"
                      : "Available"}
              </span>

              <div className="po-date-bookings">
                <h4>Client booking details</h4>

                {selectedDateBookings.length === 0 ? (
                  <p className="po-date-no-bookings">
                    No booking requests for this date.
                  </p>
                ) : (
                  selectedDateBookings.map((booking) => (
                    <article
                      className="po-client-booking"
                      key={booking.id}
                    >
                      <div className="po-client-avatar">
                        {getInitials(booking.name)}
                      </div>

                      <div className="po-client-info">
                        <strong>{booking.name}</strong>
                        <span>{booking.email}</span>
                        <span>{booking.guests} guests</span>
                        <span>{money(booking.amount)}</span>

                        <span
                          className={`po-booking-status po-booking-${booking.status.toLowerCase()}`}
                        >
                          {booking.status}
                        </span>

                        {booking.specialRequests && (
                          <p>
                            <strong>Special requests:</strong>{" "}
                            {booking.specialRequests}
                          </p>
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>

              <div className="po-availability-action">
                {selectedDateUnavailable ? (
                  <button
                    type="button"
                    className="po-unblock-date"
                    onClick={handleAvailabilityClick}
                    disabled={availabilitySaving}
                  >
                    {availabilitySaving
                      ? "Saving..."
                      : "Make Date Available"}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="po-block-date"
                    onClick={handleAvailabilityClick}
                    disabled={
                      availabilitySaving || selectedDateHasBooking
                    }
                    title={
                      selectedDateHasBooking
                        ? "Resolve pending or confirmed bookings first"
                        : "Block this date"
                    }
                  >
                    {availabilitySaving ? "Saving..." : "Block This Date"}
                  </button>
                )}

                {selectedDateHasBooking && !selectedDateUnavailable && (
                  <p>
                    Resolve pending or confirmed bookings before blocking this date.
                  </p>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </section>
  );
};

export default AvailabilityDates;