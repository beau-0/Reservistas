exports.up = function(knex) {
    return knex.schema.createTable("tables", (table) => {
      table.increments("table_id").primary();
      table.string("table_name").notNullable();
      table.integer("capacity").notNullable();
      table.boolean("occupied").defaultTo(false);
  
      // Add the reservation_id column
      table.integer("reservation_id").unsigned().references("reservation_id").inTable("reservations").onDelete("SET NULL");
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("tables");
};