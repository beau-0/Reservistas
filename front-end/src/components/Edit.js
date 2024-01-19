import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getReservation, updateReservation } from '../utils/api';
import ReservationForm from './ReservationForm';
import { formatAsDate, formatAsTime } from "../utils/date-time";

function Edit() {
    const history = useHistory();
    const { reservation_id } = useParams();
    const [error, setError] = useState(null);
    const [reservation, setReservation] = useState({
        first_name: '',
        last_name: '',
        mobile_number: '',
        reservation_date: '',
        reservation_time: '',
        people: 0, 
      });


 /*     const formatTime = (timeWithSeconds) => {
        const timeArray = timeWithSeconds.split(':');
        const hours = timeArray[0];
        const minutes = timeArray[1];
        return `${hours}:${minutes}`;
      };

      const formatDate = (dateStringWithTime) => {
        const dateWithoutTime = new Date(dateStringWithTime);
        const formattedDate = dateWithoutTime.toISOString().split('T')[0];
        return formattedDate;
      };*/

    useEffect(() => {
      const abortController = new AbortController();
      const signal = abortController.signal;

        const fetchReservation = async () => {

          try {
            const reservationData = await getReservation(reservation_id, signal);
            const originalReservation = reservationData.data; 

            setReservation({
                first_name: originalReservation.first_name,
                last_name: originalReservation.last_name,
                mobile_number: parseInt(originalReservation.mobile_number, 10),
                reservation_date: formatAsDate(originalReservation.reservation_date),
                reservation_time: formatAsTime(originalReservation.reservation_time),
                people: parseInt(originalReservation.people, 10),
                status: "booked"
              });

          } catch (error) {
            console.error('Error loading reservation data:', error);
            setError(error);
          }
        };
        fetchReservation();
        return () => abortController.abort();
      }, [reservation_id]);

  
      const handleChange = (event) => {
        if (event.target.name === "people") {
          setReservation((prevReservation) => ({
            ...prevReservation,
            [event.target.name]: Number(event.target.value),
          }));
        } else {
        const { name, value } = event.target;
        setReservation((prevReservation) => ({
          ...prevReservation,
          [name]: value,
        }));
      }
    };

      const handleSubmit = async (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        const signal = abortController.signal;

        const updatedReservation = {
          ...reservation,
          people: parseInt(reservation.people, 10), // Ensure "people" is a number
        };
        
        try {
          await updateReservation(reservation_id, updatedReservation, signal);
          // Redirect to previous page
          history.push(`/dashboard?date=${reservation.reservation_date}`);
        } catch (error) {
          console.error('Error updating reservation:', error);
          setError(error);
        }

        return () => abortController.abort();
      };
      
      const handleCancel = () => {
        // Redirect to previous page
      history.goBack();
      };

      return (
        <div>
          <h1>Edit Reservation</h1>
          <ReservationForm
            reservation={reservation}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            error={error}
          />
        </div>
      );
}

export default Edit;
