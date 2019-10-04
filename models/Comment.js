const { BaseModel } = require('./BaseModel')
const { TABLE_NAMES } = require('../shared')

class Comment extends BaseModel {

    static get tableName() {
        return TABLE_NAMES.COMMENTS
    }

    static get idColumn() {
        return 'id'
    }

    static get relationMappings() {
        const { User } = require('./User');
        const { Product } = require('./Product');

		return {
			Product: {
				relation: BaseModel.BelongsToOneRelation,
				modelClass: Product,
				join: {
					from: `${TABLE_NAMES.COMMENTS}.listId`,
					to: `${TABLE_NAMES.PRODUCTS}.listId`
				}
            },

			User: {
				relation: BaseModel.BelongsToOneRelation,
				modelClass: User,
				join: {
					from: `${TABLE_NAMES.COMMENTS}.userId`,
					to: `${TABLE_NAMES.USERS}.id`
				}
            },

			SubComment: {
				relation: BaseModel.HasManyRelation,
				modelClass: Comment,
				join: {
					from: `${TABLE_NAMES.COMMENTS}.id`,
					to: `${TABLE_NAMES.COMMENTS}.repCommentId`
				}
            },
        }
    }
}

module.exports = {
	Comment
}