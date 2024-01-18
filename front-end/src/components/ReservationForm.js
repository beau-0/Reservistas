import React from 'react';

const ReservationForm = ({ reservation, handleChange, handleSubmit, handleCancel, errors }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="first_name">First Name:</label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={reservation.first_name}
          onChange={handleChange}
          placeholder="Enter first name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="last_name">Last Name:</label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={reservation.last_name}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="mobile_number">Mobile Number:</label>
        <input
          type="text"
          id="mobile_number"
          name="mobile_number"
          value={reservation.mobile_number}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="reservation_date">Reservation Date:</label>
        <input
          type="date"
          id="reservation_date"
          name="reservation_date"
          value={reservation.reservation_date}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="reservation_time">Reservation Time:</label>
        <input
          type="time"
          id="reservation_time"
          name="reservation_time"
          value={reservation.reservation_time}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="people">Number of People:</label>
        <input
          type="number"
          id="people"
          name="people"
          value={reservation.people}
          onChange={handleChange}
        />
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="alert alert-danger">
          {Object.keys(errors).map((key) => (
            <p key={key}>{errors[key]}</p>
          ))}
        </div>
      )}

      <button type="submit">Submit</button>
      <button type="button" onClick={handleCancel}>
        Cancel
      </button>
    </form>
  );
};

export default ReservationForm;