import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getReservation, updateReservation } from '../utils/api';

function Edit() {
    const history = useHistory();
    const { reservation_id } = useParams();
    const [errors, setErrors] = useState(null);
    const [reservation, setReservation] = useState({
        first_name: '',
        last_name: '',
        mobile_number: '',
        reservation_date: '',
        reservation_time: '',
        people: 1, // Set default value or fetch from reservationData
      });

      const formatTime = (timeWithSeconds) => {
        const timeArray = timeWithSeconds.split(':');
        const hours = timeArray[0];
        const minutes = timeArray[1];
        return `${hours}:${minutes}`;
      };

      const formatDate = (dateStringWithTime) => {
        const dateWithoutTime = new Date(dateStringWithTime);
        const formattedDate = dateWithoutTime.toISOString().split('T')[0];
        return formattedDate;
      };

    useEffect(() => {
        const fetchReservation = async () => {
          try {
            const reservationData = await getReservation(reservation_id); 

            setReservation({
                first_name: reservationData.data.first_name,
                last_name: reservationData.data.last_name,
                mobile_number: reservationData.data.mobile_number,
                reservation_date: formatDate(reservationData.data.reservation_date),
                reservation_time: formatTime(reservationData.data.reservation_time),
                people: parseInt(reservationData.data.people, 10),
                status: "booked"
              });

          } catch (error) {
            console.error('Error loading reservation data:', error);
            setErrors(error.message);
          }
        };
        fetchReservation();
      }, [reservation_id]);

  
      const handleChange = (event) => {
        const { name, value } = event.target;
        setReservation((prevReservation) => ({
          ...prevReservation,
          [name]: value,
        }));
      };

      const handleSubmit = async (event) => {
        event.preventDefault();
        // Add logic to update reservation based on user entered data
        try {
          console.log("lets see: ", reservation)
          await updateReservation(reservation_id, reservation);
          // Redirect to previous page
          history.goBack();
        } catch (error) {
          console.error('Error updating reservation:', error);
          setErrors(error.message);
        }
      };
      
      const handleCancel = () => {
        // Redirect to previous page
        history.goBack();
      };

      return (
        <div>
          <h1>Edit Reservation</h1>
          {errors && <div style={{ color: 'red' }}>{errors}</div>}

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
            <button type="submit">Submit</button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </form>
        </div>
      );
}

export default Edit;
