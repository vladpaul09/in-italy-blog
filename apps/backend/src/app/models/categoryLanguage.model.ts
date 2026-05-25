import { Model, DataTypes, CreationOptional, Association, NonAttribute, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import Category from "./category.model";
import Language from "./language.model";

class CategoryLanguage extends Model<InferAttributes<CategoryLanguage>, InferCreationAttributes<CategoryLanguage>> {
  declare categoryId: number;
  declare languageId: string;
  declare name: string;
  declare description?: string;

  declare static associations: {
    category: Association<CategoryLanguage, Category>;
  };

  declare category?: NonAttribute<Category>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare language?: Language;
}

CategoryLanguage.init(
  {
    categoryId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: "category_id",
    },
    languageId: {
      type: new DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
      field: "language_id",
    },
    name: {
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
    modelName: "CategoryLanguage",
    tableName: "categories_languages",
  }
);


export default CategoryLanguage;
