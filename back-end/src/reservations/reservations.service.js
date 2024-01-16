const knex = require("../db/connection"); 

function create (reservationData) {
    const timeStampedData = {
        ...reservationData,
        created_at: new Date(),
        updated_at: new Date(),
    }
    try {
    return knex ('reservations')
        .insert(timeStampedData)
        .returning('*');
    } catch (error) {
        throw error; // Propagate the error to be caught by the asyncErrorBoundary
    }
}

function updateReservationStatus(reservation_id, status) {
    return knex("reservations")
      .where({ reservation_id })
      .update({ status }, ["*"]);
}

function list (date) {
    return knex ('reservations')
        .select('*')
        .where('reservation_date', date)
        .whereNot('status', 'finished') 
        .orderBy('reservation_time', 'asc');
}

function listByPhone(phoneNumber) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${phoneNumber.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  }

function assignTable(table_id, reservation_id) {
    return knex("tables")
    .where({ table_id })
    .update({ reservation_id: reservation_id });
}

function read (reservation_id) {
    return knex ('reservations')
        .select('*')
        .where('reservation_id', reservation_id)
        .first()
}

function search(phoneNumber) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${phoneNumber.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  }

function editReservation(reservation_id, reservationData) {
    return knex("reservations")
    .where({ reservation_id })
    .update(reservationData)
    .returning("*")
    .then(updatedReservations => {
        // Wrap the result in an array
        return updatedReservations[0];
      });
  }
 
module.exports = {
    create,
    list, 
    listByPhone,
    assignTable,
    read, 
    updateReservationStatus,
    search, 
    editReservation,
  };