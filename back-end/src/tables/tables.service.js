const knex = require("../db/connection"); 

function assignTable(table_id, reservation_id) {
    return knex("tables")
        .where({ table_id }, )
        .update({ reservation_id, occupied: true }, ["*"])
}

function getTableByName(tableName) {
    return knex("tables")
        .where({ table_name: tableName })
        .first();
  }

function getTableById(table_id) {
    return knex("tables")
    .select("*")
    .where("table_id", table_id)
    .first()
}

function getReservationById(reservation_id) {
    return knex("reservations")
        .where({ reservation_id: reservation_id })
        .first();
  }

async function createTable(tableData) {
return knex("tables")
    .insert({
    table_name: tableData.table_name,
    capacity: tableData.capacity,
    reservation_id: null, //table starts unoccupied
    })
    .returning("*");
}

async function listTables() {
    try {
        return await knex("tables")
        .select("*")
        .orderBy("table_name", "asc");
    } catch (error) {
        throw error; // Propagate the error to be caught by the asyncErrorBoundary
    }
}

async function unseatTable(table_id) {
    return knex('tables')
        .where({ table_id: table_id })
        .update({ reservation_id: null, occupied: null  });
}

module.exports = {
    assignTable,
    getTableByName, 
    getReservationById, 
    createTable, 
    listTables, 
    getTableById, 
    unseatTable
  };