// Import necessary dependencies and components
import React from "react";

// Define the TablesList component
function Tables({ tables, onFinishTable }) {
  return (
    <div>
      <h8>Active</h8><h4>Tables</h4>
        <table className="table table-bordered shadow table-outline">
          {/* Table header */}
          <thead>
            <tr>
              <th style={{ height: "49px", verticalAlign: "middle" }}>ID</th>
              <th style={{ height: "49px", verticalAlign: "middle" }}>Table No</th>
              <th style={{ height: "49px", verticalAlign: "middle" }}>Size</th>
              <th style={{ height: "49px", verticalAlign: "middle" }}>Status</th>
              <th style={{ height: "49px", verticalAlign: "middle" }}>Action</th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody>
            {tables.map((table) => (
              <tr key={table.table_id}>
                <td>{table.table_id}</td>
                <td>{table.table_name}</td>
                <td>{table.capacity}</td>
                <td data-table-id-status={table.table_id}>
                  {table.reservation_id ? <p data-table-id-status={table.table_id}> Occupied </p> : "Open"}
                </td>
                <td>
                  {table.reservation_id && (
                    <button
                      type="button"
                      data-table-id-finish={table.table_id}
                      onClick={() => onFinishTable(table.table_id, table.reservation_id)}
                      className="btn btn-outline-success btn-sm dash-buttons"
                    >
                      Finish
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}

export default Tables;