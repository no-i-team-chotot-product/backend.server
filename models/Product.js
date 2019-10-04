const { BaseModel } = require('./BaseModel')
const { TABLE_NAMES } = require('../shared')

class Product extends BaseModel {

    static get tableName() {
        return TABLE_NAMES.PRODUCTS
    }

    static get idColumn() {
        return 'id'
    }

    static get relationMappings() {
        const { User } = require('./User');
        const { UserBehavior } = require('./UserBehavior');
        const { SuggestMessage } = require('./SuggestMessage');
        const { Comment } = require('./Comment');

		return {
			User: {
				relation: BaseModel.ManyToManyRelation,
				modelClass: User,
				join: {
					from: `${TABLE_NAMES.PRODUCTS}.id`,
					through: {
						from: `${TABLE_NAMES.USER_BEHAVIORS}.productId`,
						to: `${TABLE_NAMES.USER_BEHAVIORS}.userId`
					},
					to: `${TABLE_NAMES.USERS}.id`
				}
			},

			UserBehavior: {
				relation: BaseModel.HasManyRelation,
				modelClass: UserBehavior,
				join: {
					from: `${TABLE_NAMES.PRODUCTS}.id`,
					to: `${TABLE_NAMES.USER_BEHAVIORS}.productId`
				}
            },
            
			SuggestMessage: {
                relation: BaseModel.HasManyRelation,
				modelClass: SuggestMessage,
				join: {
                    from: `${TABLE_NAMES.PRODUCTS}.category`,
					to: `${TABLE_NAMES.SUGGEST_MESS}.categoryId`
				}
            },

            Comment: {
                relation: BaseModel.HasManyRelation,
                modelClass: Comment,
                join: {
                    from: `${TABLE_NAMES.PRODUCTS}.listId`,
                    to: `${TABLE_NAMES.COMMENTS}.listId`
                }
            },
        }
    }
}

module.exports = {
    Product
}