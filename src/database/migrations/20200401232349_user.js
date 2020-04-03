exports.up = function (knex) {
  return knex.schema.createTable('users', table => {
    table.increments('userId');
    table.string('username').unique().notNullable();
    table.string('password').notNullable();
    table.boolean('available').notNullable();
    table.string('socketId');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
