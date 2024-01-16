import React, { useState, useEffect } from "react";
import { fetchTables, updateTable, updateReservationStatus } from "../utils/api";
import { useHistory, useParams } from "react-router-dom";

function Seat () {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState();
  const [errors, setErrors] = useState(null);
  
  useEffect(() => {
    const abortController = new AbortController();
    setErrors(null);
    async function loadTables() {
        try {
            const response = await fetchTables(abortController.signal)
            setTables(response)
        } catch (error) {
            setErrors(error);
        }
    }
    loadTables()
    return () => abortController.abort();
}, [])

  const handleTableSelect = (event) => {
    const selectedTableId = event.target.value;
    setSelectedTable(selectedTableId);
  };

  const handleSeatReservation = async () => {
    const abortController = new AbortController();

    try {
    // add reservation_id to table
    await updateTable(selectedTable, reservation_id);

    // Update reservation status to "seated"
    await updateReservationStatus(reservation_id, {data: { status: "seated" }});
    
    // return user to dashboard
    history.push(`/dashboard`);

    } catch (error) {
        console.error("Error assigning table:", error);
        setErrors(error.message || "Failed to assign table. Please try again.");
    }
  };

  const handleCancel = () => {
    // Redirect to the dashboard
    history.push(`/dashboard`);
  };

  return (
    <div>
      <h1>Seat Reservation</h1>
      {errors && <div style={{ color: "red" }}>{errors}</div>}
      <form className="center" onSubmit={handleSeatReservation}>
        {tables && tables.length > 0 ? (
          <div>
            <label htmlFor="tableSelect">Select a Table:</label>
            <select name="table_id" required onChange={handleTableSelect}>
              <option value="">Select..</option>
              {tables.map((table) => (
                <option value={table.table_id} key={table.table_id}>
                  {table.table_name} - {table.capacity}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p>No tables available.</p>
        )}
        <button className="button" onClick={handleCancel}>
          CANCEL
        </button>
        <button type="submit" className="button">
          SUBMIT
        </button>
      </form>
    </div>
  );
}

export default Seat;
