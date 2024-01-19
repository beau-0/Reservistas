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

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  const query = useQuery();
  const [displayDate, setDisplayDate] = useState(query.get("date") || date);
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState({});

  const abortController = new AbortController();

  const loadDashboard = async () => {
    const abortController = new AbortController();
    setError({});

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

  function formatDateString(date, param) {
    // Convert date string to a JavaScript Date object
    const currentDate = new Date(date);

    // Perform the desired operation (e.g., add or subtract a day)
    currentDate.setDate(currentDate.getDate() + param); // Example: Adding a day

    // Convert the date back to the desired format (yyyy-mm-dd)
    const formattedDate = currentDate.toISOString().split("T")[0];

    return formattedDate;
  }

  const handleToday = () => {
    setDisplayDate(date);
  };

  const handlePreviousDay = () => {
    // Use Date method (accounts for days in month) and convert back to yyyy-mm-dd
    const nextDay = formatDateString(displayDate, -1);
    setDisplayDate(nextDay);
  };

  const handleNextDay = () => {
    // Use Date method (accounts for days in month) and convert back to yyyy-mm-dd
    const nextDay = formatDateString(displayDate, 1);
    setDisplayDate(nextDay);
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
          <img
            src="https://i.ibb.co/YhL5JDt/219199018-fb-cover-1-hhnnbbvvcc.jpg"
            alt="Reservista Banner"
            className="img-fluid w-100 h-100 object-cover"
          />
          <div className="overlay"></div>
          <div className="jumbotron-content text-center text-white position-absolute w-100">
            <h1
              className="display-4 font-lucida"
              style={{ marginTop: "auto", marginBottom: "auto" }}
            >
              Reservista .. Your Table Awaits
            </h1>
          </div>
        </div>
      </div>

      {error.message && <ErrorAlert error={error} />} 

      {/* Date Navigation Buttons */}
      <div className="nav-section">
        <button
          onClick={handlePreviousDay}
          className="btn btn-warning nav-buttons btn-lg mr-2"
        >
          Previous Day
        </button>
        <button
          onClick={handleToday}
          className="btn btn-warning nav-buttons btn-lg mr-2"
        >
          Today
        </button>
        <button
          onClick={handleNextDay}
          className="btn btn-warning nav-buttons btn-lg mr-2"
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
