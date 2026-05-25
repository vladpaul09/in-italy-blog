import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from "sequelize";
import sequelize from "../../config/sequelizeConnector.config";
import Language from "./language.model";

class RegionLanguage extends Model<InferAttributes<RegionLanguage>, InferCreationAttributes<RegionLanguage>> {
  declare regionId: string;
  declare languageId: string;
  declare name: string;
  declare description: string;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

RegionLanguage.init(
  {
    regionId: {
      type: new DataTypes.STRING(2),
      primaryKey: true,
      field: "region_id",
    },
    languageId: {
      type: new DataTypes.STRING(10),
      primaryKey: true,
      field: "language_id",
    },
    name: {
      type: new DataTypes.STRING(100),
    },
    description: {
      type: DataTypes.TEXT,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "RegionLanguage",
    tableName: "regions_languages",
  }
);

export default RegionLanguage;