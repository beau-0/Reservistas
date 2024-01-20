import React, { useEffect, useState } from "react";
import {
  listReservations,
  updateReservation,
  updateReservationStatus,
  listTables,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import Tables from './Tables';
import ListReservations from "./ListReservations";
import { today } from "../utils/date-time";
import image1 from "../images/coffee4.png";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard() {
  const query = useQuery();
  const [displayDate, setDisplayDate] = useState(query.get("date") || today());
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);

  const dateObj = new Date(displayDate);
  const dayIndex = dateObj.getDay();
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const dayOfWeek = daysOfWeek[dayIndex];

  const abortController = new AbortController();

  const loadDashboard = async () => {
    const abortController = new AbortController();
    setError(null);

    try {
      // Fetch reservations for provided date
      const reservationsData = await listReservations(
        { date: displayDate },
        abortController.signal
      );

      // Filter out finished reservations
      const activeReservations = reservationsData.filter(
        (reservation) => reservation.status !== "finished"
      );

      // Fetch all tables
      const tablesData = await listTables(abortController.signal);

      setReservations(activeReservations);
      setTables(tablesData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    loadDashboard();
    return () => {
      abortController.abort();
    };
  }, [displayDate]);

  const handleToday = () => {
    setDisplayDate(new Date().toISOString().split("T")[0]);
  };

  const handlePreviousDay = () => {
    const previousDay = new Date(displayDate);
    previousDay.setDate(previousDay.getDate() - 1);
    setDisplayDate(previousDay.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    // Use Date method (accounts for days in month) and convert back to yyyy-mm-dd
    const nextDay = new Date(displayDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setDisplayDate(nextDay.toISOString().split("T")[0]);
  };

  const handleCancelReservation = async (reservation_id) => {
    const confirmation = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );

    if (confirmation) {
      try {
        // Make PUT request to update reservation status to "cancelled"
        await updateReservationStatus(reservation_id, {
          data: { status: "cancelled" }},
          abortController.signal,
        );

        loadDashboard();
      } catch (error) {
        console.error("Error cancelling reservation:", error);
        setError({
          cancel: "Failed to cancel reservation. Please try again.",
        });
      }
    }
  };

  const handleFinish = async (table_id, reservation_id) => {
    const isConfirmed = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );

    if (isConfirmed) {
      try {
        // Send DELETE request to release the table, update reservation to seated
        await updateReservationStatus(reservation_id, {
          data: { status: "finished", table_id: table_id }},
          abortController.signal,
        );

        loadDashboard();
      } catch (error) {
        console.error("Error finishing table:", error);
        setError({ message: error.message });
      }
    }
  };

  return (
    <div className="dashboard-container custom-background">
      <div className="main-content">
        {/* Jumbotron with an image */}
        <div className="jumbotron position-relative overflow-hidden">
        <img src={image1} className="img-fluid w-100 h-100 object-cover" />
          <div className="overlay"></div>
          <div className="jumbotron-content text-center text-white position-absolute w-100">
            <h1
              className="display-4 font-lucida"
              style={{ marginTop: "auto", marginBottom: "auto" }}
            >
              
            </h1>
          </div>
        </div>
      </div>

      <div className="tag">
        <h8>Reservista, Inc.</h8>
      </div>
      <ErrorAlert error={error} />
      {/* Date Navigation Buttons */}
      <div className="nav-section">
        <button
          style={{width: '120px'}}
          onClick={handlePreviousDay}
          className="btn btn-warning nav-buttons mr-2 btn-arrow-left"
        >
          Previous Day
        </button>
        <button
          style={{width: '140px'}}
          onClick={handleToday}
          className="btn btn-warning nav-buttons btn-lg mr-2"
        >
          Today
        </button>
        <button
          style={{width: '120px'}}
          onClick={handleNextDay}
          className="btn btn-warning nav-buttons mr-2"
        >
          Next Day
        </button>
      </div>

      <div className="row">
        {/* Reservations Section - 2/3 width*/}
        <section className="reservations-section">
          <ListReservations
            reservations={reservations}
            displayDate={displayDate}
            onCancelReservation={handleCancelReservation}
            dayOfWeek={dayOfWeek}
          />
        </section>

        {/* Tables Section - 1/3 width*/}
        <section className="table-section">
          <Tables
            tables={tables}
            onFinishTable={handleFinish}
          />
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
