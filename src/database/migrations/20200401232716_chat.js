exports.up = function (knex) {
  return knex.schema.createTable('chat', table => {
    table.string('id').unique().notNullable();
    table.foreign('sendingId').references('userId').inTable('users');
    table.integer('sendingId').notNullable();
    table.integer('receivingId').notNullable();
    table.foreign('receivingId').references('userId').inTable('users');
    table.boolean('enabled').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('chat');
};
