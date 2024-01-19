import React, { useState } from "react";
import { listPhones } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { formatAsDate, formatAsTime } from "../utils/date-time";


function Search() {
    const [mobileNumber, setMobileNumber] = useState("");
    const [error, setError] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
  
    const handleSearch = async (event) => {
      event.preventDefault();

      const controller = new AbortController();
      const signal = controller.signal;
  
      try {
        const results = await listPhones(mobileNumber, signal);
  
        setSearchPerformed(true);
  
        if (results.length > 0) {
          setSearchResults(results);
          setError(null);
          setMobileNumber("");
        } else {
          setSearchResults([]);
          setMobileNumber("");
          setError("No reservations found.");
        }
      } catch (error) {
        console.error(error);
        setSearchResults([]);
        setError("An error occurred while searching for reservations: ", error);
      }
    };
  
    return (
      <div>
        <h2>Search Reservations</h2>
        <form onSubmit={handleSearch}>
          <div>
            <label htmlFor="mobileNumber">Enter a customer's phone number: </label>&nbsp;
            <input
              type="text"
              id="mobileNumber"
              name="mobileNumber"
              placeholder="Customer Phone"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>
          <button type="submit">Find</button>
        </form>
  
        {/* Display search results or "No reservations found" message */}
        {searchPerformed && searchResults.length === 0 && !error && (
          <p style={{ color: "red" }}>No reservations found.</p>
        )}
  
        {/* Additional logic for displaying search results */}
        {searchResults.length > 0 && (
          <div>
            <h3>Search Results</h3>
            <table className="table table-bordered shadow table-outline">
            <thead>
            <tr>
                  <th style={{ height: "49px", verticalAlign: "middle" }}>
                    ID
                  </th>
                  <th style={{ height: "49px", verticalAlign: "middle" }}>
                    First Name
                  </th>
                  <th style={{ height: "49px", verticalAlign: "middle" }}>
                    Last Name
                  </th>
                  <th style={{ height: "49px", verticalAlign: "middle" }}>
                    Mobile Number
                  </th>
                  <th style={{ height: "49px", verticalAlign: "middle" }}>
                    Date
                  </th>
                  <th style={{ height: "49px", verticalAlign: "middle" }}>
                    Time
                  </th>
                  <th style={{ height: "49px", verticalAlign: "middle" }}>
                    People
                  </th>
                </tr>
                </thead>

                <tbody>
                {searchResults.map((result) => (
                  <tr key={result.reservation_id}>
                    <td>{result.reservation_id}</td>
                    <td>{result.first_name}</td>
                    <td>{result.last_name}</td>
                    <td>{result.mobile_number}</td>
                    <td>{formatAsDate(result.reservation_date)}</td>
                    <td>{formatAsTime(result.reservation_time)}</td>
                    <td>{result.people}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
  
        {/* Additional logic for handling errors */}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }
  
  export default Search;