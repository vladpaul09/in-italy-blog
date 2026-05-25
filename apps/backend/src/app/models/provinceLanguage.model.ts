import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from "sequelize";
import sequelize from "../../config/sequelizeConnector.config";

class ProvinceLanguage extends Model<InferAttributes<ProvinceLanguage>, InferCreationAttributes<ProvinceLanguage>> {
  declare provinceId: string;
  declare languageId: string;
  declare name: string;
  declare description: string;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

ProvinceLanguage.init(
  {
    provinceId: {
      type: new DataTypes.STRING(4),
      primaryKey: true,
      field: "province_id",
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
    modelName: "ProvinceLanguage",
    tableName: "provinces_languages",
  }
);

export default ProvinceLanguage;