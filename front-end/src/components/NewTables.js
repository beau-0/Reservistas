import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable,  } from "../utils/api";

function NewTables() {

    const [tableName, setTableName] = useState("");
    const [capacity, setCapacity] = useState("");
    const history = useHistory();
    const [errors, setErrors] = useState({});

    const handleSubmit = async (event) => {
            event.preventDefault();
            let size = parseInt(capacity, 10);

        const newTableData = {
            data: {
                table_name: tableName,
                capacity: size,
                reservation_id: null,
            }
        };

        try {
            await createTable(newTableData);
            setErrors({});
            
            //history.goBack();
            history.push("/dashboard");
            }
        catch (error) {
            console.log("error.message:", error.message);
            if (error){
                setErrors({ submit: error.message });
            } else {
                setErrors({submit: "Failed to assign table. Please try again." });
            }
        }
    }

    return (
<div className="add-table" style={{ maxWidth: '400px' }}>
  <h4>Add A Table</h4>
  <form onSubmit={handleSubmit}>
    <div className="mb-3" style={{ maxWidth: '400px' }}>
      <label htmlFor="table_name" className="form-label"></label>
      <input
        type="text"
        id="table_name"
        name="table_name"
        value={tableName}
        onChange={(e) => setTableName(e.target.value)}
        placeholder="Table Name"
        className="form-control"
        required
      />

      <label htmlFor="capacity" className="form-label"></label>
      <input
        type="number"
        id="capacity"
        name="capacity"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        placeholder="Table Capacity"
        className="form-control"
        required
      />
    </div>
    {/* Display ErrorAlert if there's a submission error */}
    {errors.submit && <ErrorAlert error={{ message: errors.submit }} />}
    <div className="mb-3">
      <button
        type="button"
        class="btn btn-outline-secondary"
        onClick={() => history.goBack()}
      >
        Cancel
      </button>
      <button type="submit" class="btn btn-outline-primary ms-2">
        Submit
      </button>
    </div>
  </form>
</div>
    )
}     

export default NewTables;  