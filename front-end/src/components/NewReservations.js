import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

function NewReservations() {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  });

  const abortController = new AbortController();
  const signal = abortController.signal;

  useEffect(() => {
    const abortController = new AbortController();
    return () => {
      abortController.abort(); // Cleanup on component unmount
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setReservation((prevReservation) => ({
      ...prevReservation,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newReservation = {
        first_name: reservation.first_name,
        last_name: reservation.last_name,
        mobile_number: reservation.mobile_number,
        reservation_date: reservation.reservation_date,
        reservation_time: reservation.reservation_time,
        people: Number(reservation.people),
        status: "booked",
      };
    

    try {
      setError({ });
      const createdReservation = await createReservation(newReservation,);
      const newReservationDate = createdReservation.reservation_date;

      history.push(`/dashboard?date=${newReservationDate}`);
    } catch (error) {
      console.error("ERROR: ", error);
      setError(error);
    }
  };

  return (
    <div className="new-reservation">
      <h4>New Reservation</h4>
      <ReservationForm
        reservation={reservation}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCancel={() => history.push("/dashboard")}
        error={error}
      />
    </div>
  );
}

export default NewReservations;
