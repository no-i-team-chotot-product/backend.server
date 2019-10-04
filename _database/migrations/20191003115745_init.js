const { TABLE_NAMES } = require('../../shared')

exports.up = async function(knex, Promise) {
	const WITHOUT_TIMEZONE = true;
	const schema = knex.schema;

	await Promise.all([
		schema.dropTableIfExists(TABLE_NAMES.COMMENTS),
		schema.dropTableIfExists(TABLE_NAMES.SUGGEST_MESS),
		schema.dropTableIfExists(TABLE_NAMES.USER_BEHAVIORS),
		schema.dropTableIfExists(TABLE_NAMES.PRODUCTS),
		schema.dropTableIfExists(TABLE_NAMES.USERS),
	]);

	await schema.createTable(TABLE_NAMES.USERS, function(table) {
		table.increments('id').primary();
		table.string('fingerprint', 100).notNullable();
		table.string('name', 100);
		table.string('region', 100);
		table.string('city', 100);
		table.timestamp('createdAt', WITHOUT_TIMEZONE);
	});

	await schema.createTable(TABLE_NAMES.PRODUCTS, function(table) {
		table.increments('id').primary();
		table.string('listId', 100).unique();
		table.string('categoryName', 100);
		table.string('category').unique();
		table.integer('userId').references('id').inTable(TABLE_NAMES.USERS);
		table.integer('price');
		table.boolean('isSolve').default(false);
        table.timestamp('createdAt', WITHOUT_TIMEZONE);
	});

	await schema.createTable(TABLE_NAMES.USER_BEHAVIORS, function(table) {
		table.increments('id').primary();
		table.integer('userId').references('id').inTable(TABLE_NAMES.USERS);
        table.integer('productId').references('id').inTable(TABLE_NAMES.PRODUCTS);
	});
	
	await schema.createTable(TABLE_NAMES.SUGGEST_MESS, function(table) {
		table.increments('id').primary();
		table.integer('permission');
		table.string('categoryId').references('category').inTable(TABLE_NAMES.PRODUCTS);
		table.string('body', 255);
	});
	
	await schema.createTable(TABLE_NAMES.COMMENTS, function(table) {
		table.increments('id').primary();
		table.integer('userId').references('id').inTable(TABLE_NAMES.USERS);
		table.string('listId').references('listId').inTable(TABLE_NAMES.PRODUCTS);
		table.string('body', 255);
		table.integer('repCommentId').references('id').inTable(TABLE_NAMES.COMMENTS);
		table.timestamp('commentTime', WITHOUT_TIMEZONE);
	});
};

exports.down = async function(knex, Promise) {
	const schema = knex.schema;

	await Promise.all([
		schema.dropTableIfExists(TABLE_NAMES.COMMENTS),
		schema.dropTableIfExists(TABLE_NAMES.SUGGEST_MESS),
		schema.dropTableIfExists(TABLE_NAMES.USER_BEHAVIORS),
		schema.dropTableIfExists(TABLE_NAMES.PRODUCTS),
		schema.dropTableIfExists(TABLE_NAMES.USERS),
	]);
};
