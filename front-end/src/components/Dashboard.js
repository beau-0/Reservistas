import React, { useEffect, useState } from "react";
import { listReservations, updateReservation, updateReservationStatus, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { Link } from "react-router-dom";
import useQuery from "../utils/useQuery";

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
  const [errors, setErrors] = useState({});

  const abortController = new AbortController();

  const loadDashboard = async () => {
    const abortController = new AbortController();
    setErrors({});

    try {
      // Fetch reservations for provided date
      const reservationsData = await listReservations({ date: displayDate }, abortController.signal);

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
        setErrors(error.message);
    }
  };

  useEffect(() => {
    loadDashboard();
    return () => {
      abortController.abort();
    }
  }, [displayDate]);   

  function formatDateString(date, param) {
    // Convert date string to a JavaScript Date object
    const currentDate = new Date(date);
    
    // Perform the desired operation (e.g., add or subtract a day)
    currentDate.setDate(currentDate.getDate() + param); // Example: Adding a day
  
    // Convert the date back to the desired format (yyyy-mm-dd)
    const formattedDate = currentDate.toISOString().split('T')[0];
    
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
        await updateReservation(reservation_id, {
          data: { status: "cancelled" },
        });

        loadDashboard();
      } catch (error) {
        console.error("Error cancelling reservation:", error);
        setErrors({
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
        await updateReservationStatus(reservation_id, {data: {status: "finished", table_id: table_id }});

        loadDashboard();
      } catch (error) {
        console.error("Error finishing table:", error);
        setErrors ({ message: error.message });
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

      {errors.message && <ErrorAlert error={errors} />}

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
          <h4>Reservations for {displayDate}</h4>
          {reservations.length > 0 ? (
            <table className="table table-bordered shadow table-outline">
              <thead>
                <tr>
                  <th style={{ height: "40px" }}>ID</th>
                  <th style={{ height: "40px" }}>Name & Phone</th>
                  <th style={{ height: "40px" }}>Date</th>
                  <th style={{ height: "40px" }}>Time</th>
                  <th style={{ height: "40px" }}>People</th>
                  <th style={{ height: "40px" }}>Status</th>
                  <th style={{ height: "40px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.reservation_id}>
                    <td>{reservation.reservation_id}</td>
                    <td>
                      {`${reservation.first_name} ${reservation.last_name}`}
                      <br />
                      {reservation.mobile_number}
                    </td>
                    <td>{displayDate}</td>
                    <td>{reservation.reservation_time}</td>
                    <td>{reservation.people}</td>
                    <td>{reservation.status}</td>
                    <td>
                      {(reservation.status === "booked" ) &&(
                        <div className="d-flex flex-column">
                          <Link to={`/reservations/${reservation.reservation_id}/seat`} >
                            <button
                              type="button"
                              className="btn btn-outline-info btn-sm mb-2 btn-block dash-buttons"
                            > Seat </button>
                          </Link>
                          <Link to={`/reservations/${reservation.reservation_id}/edit`}>
                            <button
                              type="button"
                              className="btn btn-outline-warning btn-sm mb-2 btn-block dash-buttons"
                            > Edit </button>
                          </Link>
                          <button
                            type="button"
                            data-reservation-id-cancel={
                              reservation.reservation_id
                            }
                            onClick={() =>
                              handleCancelReservation(
                                reservation.reservation_id
                              )
                            }
                            className="btn btn-outline-danger btn-sm mb-2 btn-block dash-buttons"
                          > Cancel </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No reservations for {displayDate}</p>
          )}
        </section>

        {/* Tables Section - 1/3 width*/}
        <section className="table-section">
          <h4 >Tables</h4>
          {tables.length >0 ? (
            <table className="table table-bordered shadow table-outline">
              <thead>
                <tr>
                  <th style={{ height: "49px", verticalAlign: "middle" }}>
                    ID
                  </th>
                  <th style={{ height: "49px", verticalAlign: "middle" }}>
                    Table No
                  </th>
                  <th style={{ height: "49px", verticalAlign: "middle" }}>
                    Size
                  </th>
                  <th style={{ height: "49px", verticalAlign: "middle" }}>
                    Status
                  </th>
                  <th style={{ height: "49px", verticalAlign: "middle" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {tables.map((table) => (
                  <tr key={table.table_id}>
                    <td>{table.table_id}</td>
                    <td>{table.table_name}</td>
                    <td>{table.capacity}</td>
                    <td data-table-id-status={table.table_id}>
                      {table.reservation_id ? <p data-table-id-status={table.table_id}> Occupied </p> : "Open"}
                    </td>
                    <td>
                      {table.reservation_id && (
                        <button
                          type="button"
                          data-table-id-finish={table.table_id}
                          onClick={() =>
                            handleFinish(table.table_id, table.reservation_id)
                          }
                          className="btn btn-outline-success btn-sm dash-buttons"
                        >
                          Finish
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No tables available</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
