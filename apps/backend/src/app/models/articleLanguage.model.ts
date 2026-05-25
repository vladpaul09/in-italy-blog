import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, NonAttribute, Association } from "sequelize";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import Language from "./language.model";

class ArticleLanguage extends Model<InferAttributes<ArticleLanguage>, InferCreationAttributes<ArticleLanguage>> {
  declare articleId: number;
  declare languageId: string;
  declare title: string;
  declare description?: string | null;

  declare static associations: {
    // article: Association<ArticleLanguage, Article>;
    language: Association<ArticleLanguage, Language>;
  };

  // declare article?: NonAttribute<Article>;
  declare language?: NonAttribute<Language>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ArticleLanguage.init(
  {
    articleId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: "article_id",
    },
    languageId: {
      type: new DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
      field: "language_id",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: sequelizeConnector,
    modelName: "ArticleLanguage",
    tableName: "articles_languages",
  }
);


export default ArticleLanguage;
