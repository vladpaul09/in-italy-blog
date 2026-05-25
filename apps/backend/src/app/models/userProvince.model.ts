import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from "sequelize";
import sequelize from "../../config/sequelizeConnector.config";

class UserProvince extends Model<InferAttributes<UserProvince>, InferCreationAttributes<UserProvince>> {
  declare provinceId: string;
  declare userId: number;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

UserProvince.init(
  {
    provinceId: {
      type: new DataTypes.STRING(4),
      primaryKey: true,
      field: "province_id"
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
    modelName: "UserProvince",
    tableName: "users_provinces",
  }
);

export default UserProvince;
