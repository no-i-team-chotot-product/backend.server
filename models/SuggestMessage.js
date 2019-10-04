const { BaseModel } = require('./BaseModel')
const { TABLE_NAMES } = require('../shared')

class SuggestMessage extends BaseModel {

    static get tableName() {
        return TABLE_NAMES.SUGGEST_MESS
    }

    static get idColumn() {
        return 'id'
    }

    static get relationMappings() {
        const { Product } = require('./Product');

		return {
			Product: {
				relation: BaseModel.HasManyRelation,
				modelClass: Product,
				join: {
					from: `${TABLE_NAMES.SUGGEST_MESS}.categoryId`,
					to: `${TABLE_NAMES.PRODUCTS}.category`
				}
            },
        }
    }
}

module.exports = {
    SuggestMessage
}