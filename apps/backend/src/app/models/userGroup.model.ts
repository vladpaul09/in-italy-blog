import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from "sequelize";
import sequelizeConnector from "../../config/sequelizeConnector.config";

class UserGroup extends Model<InferAttributes<UserGroup>, InferCreationAttributes<UserGroup>> {
  declare userId: number;
  declare groupId: number;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

UserGroup.init(
  {
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      field: "user_id",
    },
    groupId: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      field: "group_id",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: sequelizeConnector,
    modelName: "UserGroup",
    tableName: "users_groups",
  }
);

export default UserGroup;
