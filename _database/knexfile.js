const { knexSnakeCaseMappers } = require('objection')

// Update with your config settings.
module.exports = {

	client: 'pg',
	connection: {
		host: 'localhost',
		user: 'postgres',
		password: 'postgres',
		database: 'no_i_chotot'
	},
	...knexSnakeCaseMappers()

};
