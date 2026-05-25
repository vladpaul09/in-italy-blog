import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from "sequelize";
import sequelizeConnector from "../../config/sequelizeConnector.config";

class Permission extends Model<InferAttributes<Permission>, InferCreationAttributes<Permission>> {
  declare codename: string;
  declare resource: string;
  declare action: string;
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

Permission.init(
  {
    codename: {
      type: DataTypes.STRING(100),
      primaryKey: true,
    },
    resource: {
      type: new DataTypes.STRING(255),
    },
    action: {
      type: new DataTypes.STRING(100),
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: sequelizeConnector,
    modelName: "permission",
    tableName: "permissions",
  }
);

export default Permission;
