import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from "sequelize";
import sequelize from "../../config/sequelizeConnector.config";

class UserMunicipality extends Model<InferAttributes<UserMunicipality>, InferCreationAttributes<UserMunicipality>> {
  declare municipalityId: string;
  declare userId: number;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

UserMunicipality.init(
  {
    municipalityId: {
      type: new DataTypes.STRING(10),
      primaryKey: true,
      field: "municipality_id"
    },
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      field: "user_id"
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "UserMunicipality",
    tableName: "users_municipalities",
  }
);

export default UserMunicipality;
