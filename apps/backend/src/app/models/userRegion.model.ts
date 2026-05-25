import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from "sequelize";
import sequelize from "../../config/sequelizeConnector.config";

class UserRegion extends Model<InferAttributes<UserRegion>, InferCreationAttributes<UserRegion>> {
  declare regionId: string;
  declare userId: number;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

UserRegion.init(
  {
    regionId: {
      type: new DataTypes.STRING(2),
      primaryKey: true,
      field: "region_id"
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
    modelName: "UserRegion",
    tableName: "users_regions",
  }
);

export default UserRegion;
