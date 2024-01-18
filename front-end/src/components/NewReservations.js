import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

function NewReservations() {
  const history = useHistory();
  const [errors, setErrors] = useState({});
  const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  });

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
      data: {
        first_name: reservation.first_name,
        last_name: reservation.last_name,
        mobile_number: reservation.mobile_number,
        reservation_date: reservation.reservation_date,
        reservation_time: reservation.reservation_time,
        people: Number(reservation.people),
      },
    };

    try {
      const createdReservation = await createReservation(newReservation);
      const newReservationDate = createdReservation.reservation_date;

      setErrors({});
      history.push(`/dashboard?date=${newReservationDate}`);
    } catch (error) {
      console.log("error.message:", error.message);
      if (error) {
        setErrors({ submit: error.message });
      } else {
        setErrors({
          submit: "Failed to submit reservation. Please try again.",
        });
      }
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
        errors={errors}
      />
    </div>
  );
}

export default NewReservations;
