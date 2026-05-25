import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Association, NonAttribute } from "sequelize";
import sequelize from "../../config/sequelizeConnector.config";
import Article from "./article.model";
import Municipality from "./municipality.model";

class ArticleMunicipality extends Model<InferAttributes<ArticleMunicipality>, InferCreationAttributes<ArticleMunicipality>> {
  declare articleId: number;
  declare municipalityId: string;

  declare static associations: {
    article: Association<ArticleMunicipality, Article>;
    municipality: Association<ArticleMunicipality, Municipality>;
  };

  declare article?: NonAttribute<Article>;
  declare municipality?: NonAttribute<Municipality>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ArticleMunicipality.init(
  {
    articleId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: "article_id",
    },
    municipalityId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      field: "municipality_id",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "ArticleMunicipality",
    tableName: "articles_municipalities",
  }
);

export default ArticleMunicipality;
