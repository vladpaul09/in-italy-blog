import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Association, NonAttribute } from "sequelize";
import sequelizeConnector from "../../config/sequelizeConnector.config";

class ArticleCategory extends Model<InferAttributes<ArticleCategory>, InferCreationAttributes<ArticleCategory>> {
  declare articleId: number;
  declare categoryId: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ArticleCategory.init(
  {
    articleId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: "article_id",
    },
    categoryId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: "category_id",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: sequelizeConnector,
    modelName: "ArticleCategory",
    tableName: "articles_categories",
  }
);

export default ArticleCategory;
