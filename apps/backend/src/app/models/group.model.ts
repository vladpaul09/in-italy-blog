import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Association, NonAttribute } from "sequelize";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import Permission from "./permission.model";
import User from "./user.model";

class Group extends Model<InferAttributes<Group>, InferCreationAttributes<Group>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description?: string;

  declare static associations: {
    permissions: Association<Group, Permission>;
    users: Association<Group, User>;
  };

  declare permissions?: NonAttribute<Array<Permission>>;
  declare users?: NonAttribute<Array<User>>;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

Group.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(100),
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
    modelName: "Group",
    tableName: "groups",
  }
);

export default Group;
