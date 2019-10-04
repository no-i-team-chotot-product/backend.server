const { Model } = require('objection')
const Knex = require('knex')

const config = require('../_database/knexfile')
const knex = Knex(config)
Model.knex(knex)

module.exports = {
    BaseModel: Model
}