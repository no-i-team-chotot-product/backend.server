const { BaseModel } = require('./BaseModel')
const { TABLE_NAMES } = require('../shared')

class User extends BaseModel {

    static get tableName() {
        return TABLE_NAMES.USERS
    }

    static get idColumn() {
        return 'id'
    }

    static get relationMappings() {
        const { Product } = require('./Product');
        const { UserBehavior } = require('./UserBehavior');
        const { Comment } = require('./Comment');

		return {
			Product: {
				relation: BaseModel.ManyToManyRelation,
				modelClass: Product,
				join: {
					from: `${TABLE_NAMES.USERS}.id`,
					through: {
						from: `${TABLE_NAMES.USER_BEHAVIORS}.userId`,
						to: `${TABLE_NAMES.USER_BEHAVIORS}.productId`
					},
					to: `${TABLE_NAMES.PRODUCTS}.id`
				}
			},

			UserBehavior: {
				relation: BaseModel.HasManyRelation,
				modelClass: UserBehavior,
				join: {
					from: `${TABLE_NAMES.USERS}.id`,
					to: `${TABLE_NAMES.USER_BEHAVIORS}.userId`
				}
            },

			Comment: {
				relation: BaseModel.HasManyRelation,
				modelClass: Comment,
				join: {
					from: `${TABLE_NAMES.USERS}.id`,
					to: `${TABLE_NAMES.COMMENTS}.userId`
				}
            },
        }
    }
}

module.exports = {
	User
}