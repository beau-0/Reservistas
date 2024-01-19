import React from "react";
import { Link } from "react-router-dom";

function ListReservations ({ reservations, displayDate, onCancelReservation }) {
    return (
        <div>
          <h4>Reservations for {displayDate}</h4>
          {reservations.length > 0 ? (
            <table className="table table-bordered shadow table-outline">
              {/* Table header */}
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
              {/* Table body */}
              <tbody>
                {reservations.map((reservation) => {
                   return (
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
                      {(reservation.status === "booked") && (
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
                            data-reservation-id-cancel={reservation.reservation_id}
                            onClick={() => onCancelReservation(reservation.reservation_id)}
                            className="btn btn-outline-danger btn-sm mb-2 btn-block dash-buttons"
                          > Cancel </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
                      })}
              </tbody>
            </table>
          ) : (
            <p>No reservations for {displayDate}</p>
          )}
        </div>
      );
    }

export default ListReservations;