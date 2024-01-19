/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
/**
 * Defines the default headers for these functions to work with `json-server`
 */

const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}
/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

// RESERVATIONS 

export async function listReservations(params, signal) {  
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );

  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

export async function createReservation(reservationData, signal) {
  const response = await fetch(`${API_BASE_URL}/reservations/new`,
  {
    method: 'POST',
    body: JSON.stringify({ data: reservationData }),
    headers: {
      'Content-Type': 'application/json',
    },
    signal
  });

  if(!response.ok){
    const errorData = await response.json();
    const errorMessage = errorData.error;
    throw new Error(errorMessage );
  }

  const responseData = await response.json();
  return responseData.data;
}

export async function getReservation(reservation_id, signal) {
  
  try {
      const response = await fetch(`${API_BASE_URL}/reservations/${reservation_id}`, { signal });
      if (!response.ok) {
        console.error("Error fetching reservations:", response.json());
        throw new Error("Failed to find reservation.");
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error("Error: ", error);
      throw error;
  }
}

// Update the status (only) of the reservation. Bypasses the data checks of "edit" reservation. 
export async function updateReservation(reservationId, updatedReservation, signal) {
  try {
    const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( { data: updatedReservation }),
      signal,
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error updating reservation:", errorResponse);
      throw new Error(`Failed to update reservation. ${errorResponse.error || ''}`);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error updating reservation:", error.message);
    throw error;
  }
} 


// instructions require different endpoint for a status update than other reservation updates 
export async function updateReservationStatus(reservationId, param, signal) {

  try {
    const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( param ),
    }, signal
    );

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to update reservation status: ${error.message}`);
  }
  };

// TABLES
export async function createTable (tableData, signal) {

  const response = await fetch(`${API_BASE_URL}/tables`,
  {
    method: 'POST',
    body: JSON.stringify(tableData),
    headers: {
      'Content-Type': 'application/json',
    },
    signal
  });

  if(!response.ok){
    const errorData = await response.json();
    const errorMessage = errorData.error;
    throw new Error(errorMessage || 'Failed to complete table assignment.');
  }

  return response.json();
}

export async function assignTable (table_id, reservation_id) {
  const response = await fetch(`${API_BASE_URL}/tables/${table_id}/seat`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        table_id: table_id,
        reservation_id: reservation_id,
      },
    }),
  });

  if(!response.ok){
    const errorData = await response.json();
    const errorMessage = errorData.error;
    throw new Error(errorMessage || 'Failed to assign table.');
  }

  const responseData = await response.json();
  return responseData.data;
}

export async function listTables(signal) {
  try {
      const response = await fetch(`${API_BASE_URL}/tables`, { signal });
      
      if (!response.ok) {
          throw new Error("Failed to fetch tables.");
      }
      const tableData = await response.json();
      return tableData.data;
  } catch (error) {
      console.error("Error fetching tables: ", error);
      throw error;
  }
}

export async function finishTable(table_id) {
  try {
    const response = await fetch(`${API_BASE_URL}/tables/${table_id}/seat`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    throw new Error(`Failed to finish table: ${error.message}`);
  }
}

export async function updateTable (table_id, reservation_id) {

  try {
  const response = await fetch(`${API_BASE_URL}/tables/${table_id}/seat`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        reservation_id: reservation_id,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  } 

  } catch (error) {
    console.error("ERROR: ", error);
    throw new Error(`Unable to seat: ${error.message}`);
  }
}

// SEARCH
export async function listPhones (phoneNumber, signal) {
  try {
      const response = await fetch(`${API_BASE_URL}/reservations?mobile_number=${phoneNumber}`,{
        signal,
      });
      if (!response.ok) {
          throw new Error(`Error fetching reservations: ${response.status} - ${response.statusText}`);
        }

      const data = await response.json();
      return data.data;

  } catch (error) {
      console.error("Error fetching tables:", error);
      throw error;
  }
}






