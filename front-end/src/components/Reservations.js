import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation} from "../utils/api";

function Reservations () {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [reservationDate, setReservationDate] = useState("");
    const [reservationTime, setReservationTime] = useState("");
    const [people, setPeople] = useState("");
    const history = useHistory();
    const [errors, setErrors] = useState({});

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const newReservation = {
            data: {
                first_name: firstName, 
                last_name: lastName,
                mobile_number: mobileNumber,
                reservation_date: reservationDate,
                reservation_time: reservationTime,
                people: Number(people)
            }
        };

        try {
            const createdReservation = await createReservation(newReservation);
            const newReservationDate = createdReservation.reservation_date;
            
            
            setErrors({});
            history.push(`/dashboard?date=${newReservationDate}`);
            }
        catch (error) {
            console.log("error.message:", error.message);
            if (error){
                setErrors({ submit: error.message });
            } else {
                setErrors({submit: "Failed to submit reservation. Please try again." });
            }
        } 
    } 
          
    return (
<div className="new-reservation">
  <h4>New Reservation</h4>
  <form onSubmit={handleSubmit} className="reservation-form">
    <div className="form-group">
      <label htmlFor="first_name"></label>
      <div className="name-inputs">
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={firstName}
          onChange={(e) => {setFirstName(e.target.value)}}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={lastName}
          onChange={(e) => {setLastName(e.target.value)}}
          placeholder="Last Name"
          required
        />
      </div>
    </div>

    <div className="form-group">
      <label htmlFor="mobile_number"></label>
      <input
        type="tel"
        id="mobile_number"
        name="mobile_number"
        value={mobileNumber}
        onChange={(e) => {setMobileNumber(e.target.value)}}
        placeholder="Enter your phone number"
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="reservation_date"></label>
      <input
        type="date"
        id="reservation_date"
        name="reservation_date"
        value={reservationDate}
        onChange={(e) => {setReservationDate(e.target.value)}}
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="reservation_time"></label>
      <input
        type="time"
        id="reservation_time"
        name="reservation_time"
        value={reservationTime}
        onChange={(e) => {setReservationTime(e.target.value)}}
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="people"></label>
      <input
        type="number"
        id="people"
        name="people"
        value={people}
        onChange={(e) => {setPeople(e.target.value)}}
        placeholder="Number of people"
        required
      />
    </div>

    {/* Display ErrorAlert if there's a submission error */}
    {errors.submit && <ErrorAlert error={{ message: errors.submit }} />}

    <div className="form-buttons">
      <Link to="/dashboard">
        <button type="button" className="btn btn-secondary">Cancel</button>
      </Link>
      <button type="submit" className="btn btn-primary">Submit</button>
    </div>
  </form>
</div>
    )
}

export default Reservations;