import React, { useState, useEffect } from "react";
import {
  fetchTables,
  updateTable,
  updateReservationStatus,
} from "../utils/api";
import { useHistory, useParams } from "react-router-dom";

function Seat() {
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
        const response = await fetchTables(abortController.signal);
        setTables(response);
      } catch (error) {
        setErrors(error);
      }
    }
    loadTables();
    return () => abortController.abort();
  }, []);

  function handleTableSelect({ target: { value } }) {
    setSelectedTable(value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    //const abortController = new AbortController();

    try {
      // add reservation_id to table
      await updateTable(selectedTable, reservation_id);

      // Update reservation status to "seated"
      await updateReservationStatus(reservation_id, {
        data: { status: "seated" },
      });

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
      <h3>Assign a Table</h3>
      <form onSubmit={handleSubmit}>
      <label htmlFor="tables">Select a table:</label>
        <select
          name="table_id"
          id="tables"
          onChange={handleTableSelect}
          value={selectedTable}
        >
          <option value="">Select a table</option>
          {tables.map((table) => (
            <option key={table.table_id} value={table.table_id}>
              {`${table.table_name} - ${table.capacity}`}
            </option>
          ))}
        </select><br />
        <button className="btn btn-warning" onClick={handleCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      {errors && <div style={{ color: "red" }}>{errors}</div>}
    </div>
  );
}

export default Seat;
