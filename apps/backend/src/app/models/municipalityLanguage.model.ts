import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from "sequelize";
import sequelize from "../../config/sequelizeConnector.config";

class MunicipalityLanguage extends Model<InferAttributes<MunicipalityLanguage>, InferCreationAttributes<MunicipalityLanguage>> {
  declare municipalityId: string;
  declare languageId: string;
  declare name: string;
  declare description: string;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

MunicipalityLanguage.init(
  {
    municipalityId: {
      type: new DataTypes.STRING(10),
      primaryKey: true,
      field: "municipality_id",
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
    modelName: "MuncipalityLanguage",
    tableName: "municipalities_languages",
  }
);

export default MunicipalityLanguage;
