import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, NonAttribute, Association } from "sequelize";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import Language from "./language.model";

class PageLanguage extends Model<InferAttributes<PageLanguage>, InferCreationAttributes<PageLanguage>> {
  declare pageId: number;
  declare languageId: string;
  declare metaTitle: string;
  declare metaDescription: string;
  declare pageTitle: string;
  declare pageDescription: string;

  declare static associations: {
    language: Association<PageLanguage, Language>;
  };

  declare language?: NonAttribute<Language>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

PageLanguage.init(
  {
    pageId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: "page_id",
    },
    languageId: {
      type: new DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
      field: "language_id",
    },
    metaTitle: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "meta_title",
    },
    metaDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "meta_description",
    },
    pageTitle: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "page_title",
    },
    pageDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "page_description",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: sequelizeConnector,
    modelName: "PageLanguage",
    tableName: "pages_languages",
  }
);

export default PageLanguage;
