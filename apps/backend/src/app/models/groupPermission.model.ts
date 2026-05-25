import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from "sequelize";
import sequelizeConnector from "../../config/sequelizeConnector.config";

class GroupPermission extends Model<InferAttributes<GroupPermission>, InferCreationAttributes<GroupPermission>> {
  declare groupId: number;
  declare permissionCodename: string;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

GroupPermission.init(
  {
    groupId: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      field: "group_id"
    },
    permissionCodename: {
      type: DataTypes.STRING(100),
      primaryKey: true,
      field: "permission_codename"
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: sequelizeConnector,
    modelName: "GroupPermission",
    tableName: "groups_permissions",
  }
);

export default GroupPermission;
