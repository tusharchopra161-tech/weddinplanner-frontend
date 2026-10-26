import React from 'react'
import { useEffect, useMemo, useState } from "react" ;
import "./weddingDateCalendar.css"
import {
  FaChevronLeft,
  FaChevronRight,
  FaRegCalendarAlt,
} from "react-icons/fa";
const API_URL = "https://weddingplanner-backend.onrender.com";
const pad = (number) => String(number).padStart(2, "0");
const formatDate = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const getMonthKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
const parseLocalDate = (value) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};
export default function WeddingDateCalendar({
  palaceId,
  value,
  minDate,
  onChange,
}) {
  const minimumDate = useMemo(
    () => parseLocalDate(minDate),
    [minDate]
  );

  const [visibleMonth, setVisibleMonth] = useState(() => {
    const initialDate = value ? parseLocalDate(value) : minimumDate;
    return new Date(
      initialDate.getFullYear(),
      initialDate.getMonth(),
      1
    );
  });

  const [availability, setAvailability] = useState({
    isAvailable: true,
    unavailableDates: [],
    confirmedDates: [],
    pendingDates: [],
  });

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const monthKey = getMonthKey(visibleMonth);
  const firstWeekday = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth(),
    1
  ).getDay();

  const daysInMonth = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    0
  ).getDate();

  const minimumMonth = getMonthKey(minimumDate);
  const canGoPrevious = monthKey > minimumMonth;

  useEffect(() => {
    if (!palaceId) return;

    const controller = new AbortController();

    const fetchAvailability = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch(
          `${API_URL}/booking/palace/${palaceId}/availability?month=${monthKey}`,
          { signal: controller.signal }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load calendar availability."
          );
        }

        setAvailability({
          isAvailable: data.isAvailable !== false,
          unavailableDates: data.unavailableDates || [],
          confirmedDates: data.confirmedDates || [],
          pendingDates: data.pendingDates || [],
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          setLoadError(
            error.message || "Unable to load calendar availability."
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchAvailability();

    return () => controller.abort();
  }, [palaceId, monthKey]);

  const blockedDates = useMemo(
    () =>
      new Set([
        ...availability.unavailableDates,
        ...availability.confirmedDates,
        ...availability.pendingDates,
      ]),
    [availability]
  );

  const changeMonth = (amount) => {
    setVisibleMonth((current) => {
      const next = new Date(
        current.getFullYear(),
        current.getMonth() + amount,
        1
      );

      if (getMonthKey(next) < minimumMonth) return current;
      return next;
    });
  };

  const selectDate = (dateString) => {
    if (loading || loadError || !availability.isAvailable) return;
    if (dateString < minDate || blockedDates.has(dateString)) return;

    onChange(dateString);
  };

  const calendarDays = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  return (
    <div className="wdc-calendar">
      <div className="wdc-heading">
        <div className="wdc-heading-icon">
          <FaRegCalendarAlt />
        </div>
        <div>
          <strong>Choose your wedding date</strong>
          <p>Select an available day</p>
        </div>
      </div>

      <div className="wdc-month-navigation">
        <button
          type="button"
          className="wdc-month-button"
          onClick={() => changeMonth(-1)}
          disabled={!canGoPrevious || loading}
          aria-label="Previous month"
        >
          <FaChevronLeft />
        </button>

        <strong>
          {visibleMonth.toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric",
          })}
        </strong>

        <button
          type="button"
          className="wdc-month-button"
          onClick={() => changeMonth(1)}
          disabled={loading}
          aria-label="Next month"
        >
          <FaChevronRight />
        </button>
      </div>

      {loading && (
        <p className="wdc-status-message">Checking available dates...</p>
      )}

      {loadError && (
        <p className="wdc-error" role="alert">
          {loadError}
        </p>
      )}

      {!loading && !loadError && !availability.isAvailable && (
        <p className="wdc-error" role="alert">
          This palace is currently unavailable for booking.
        </p>
      )}

      <div className="wdc-grid" aria-label="Wedding dates">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
          (day) => (
            <div className="wdc-weekday" key={day}>
              {day}
            </div>
          )
        )}

        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div className="wdc-empty" key={`empty-${index}`} />;
          }

          const dateString = formatDate(
            new Date(
              visibleMonth.getFullYear(),
              visibleMonth.getMonth(),
              day
            )
          );

          const isPastMinimum = dateString < minDate;
          const isBlocked = blockedDates.has(dateString);
          const isSelected = value === dateString;
          const isDisabled =
            isPastMinimum ||
            isBlocked ||
            !availability.isAvailable ||
            loading ||
            Boolean(loadError);

          let statusClass = "";

          if (isSelected) {
            statusClass = "wdc-selected";
          } else if (isBlocked) {
            statusClass = "wdc-unavailable";
          } else if (!isPastMinimum) {
            statusClass = "wdc-available";
          }

          return (
            <button
              type="button"
              key={dateString}
              className={`wdc-day ${statusClass}`}
              disabled={isDisabled}
              onClick={() => selectDate(dateString)}
              aria-label={`${dateString}${
                isBlocked ? ", unavailable" : ""
              }`}
              aria-pressed={isSelected}
              title={
                isBlocked
                  ? "This date is unavailable"
                  : isPastMinimum
                  ? "Bookings require at least 20 days' notice"
                  : "Available date"
              }
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="wdc-legend">
        <span>
          <i className="wdc-dot wdc-dot-available" />
          Available
        </span>
        <span>
          <i className="wdc-dot wdc-dot-unavailable" />
          Unavailable
        </span>
        <span>
          <i className="wdc-dot wdc-dot-selected" />
          Selected
        </span>
      </div>

      <div className="wdc-selected-date">
        <span>Selected date</span>
        <strong>
          {value
            ? parseLocalDate(value).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "No date selected"}
        </strong>
      </div>
    </div>
  );
}
