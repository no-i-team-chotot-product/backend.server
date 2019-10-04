const { BaseModel } = require('./BaseModel')
const { TABLE_NAMES } = require('../shared')

class UserBehavior extends BaseModel {

    static get tableName() {
        return TABLE_NAMES.USER_BEHAVIORS
    }

    static get idColumn() {
        return 'id'
    }

    static get relationMappings() {
        const { User } = require('./User')
        const { Product } = require('./Product')
        return {
			User: {
				relation: BaseModel.BelongsToOneRelation,
				modelClass: User,
				join: {
					from: `${TABLE_NAMES.USER_BEHAVIORS}.userId`,
					to: `${TABLE_NAMES.USERS}.id`
				}
			},
			
			Product: {
				relation: BaseModel.BelongsToOneRelation,
				modelClass: Product,
				join: {
					from: `${TABLE_NAMES.USER_BEHAVIORS}.productId`,
					to: `${TABLE_NAMES.PRODUCTS}.id`
				}
            },
		};
    }
}

module.exports = {
	UserBehavior
}