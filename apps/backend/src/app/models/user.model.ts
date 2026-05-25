import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, NonAttribute } from "sequelize";
import sequelize from "../../config/sequelizeConnector.config";
import Group from "./group.model";
import Region from "./region.model";
import Province from "./province.model";
import Municipality from "./municipality.model";
import UserAlias from "./userAlias.model";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare firstName: string;
  declare lastName: string;
  declare password: string;
  declare email: string;
  declare isSuperUser: boolean;

  declare groups?: NonAttribute<Array<Group>>;
  declare regions?: NonAttribute<Array<Region>>;
  declare provinces?: NonAttribute<Array<Province>>;
  declare municipalities?: NonAttribute<Array<Municipality>>;
  declare aliases?: NonAttribute<Array<UserAlias>>;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: new DataTypes.STRING(100),
      field: "first_name",
    },
    lastName: {
      type: new DataTypes.STRING(100),
      field: "last_name",
    },
    password: {
      type: new DataTypes.STRING(100),
    },
    email: {
      type: new DataTypes.STRING(255),
    },
    isSuperUser: {
      type: new DataTypes.BOOLEAN(),
      field: "is_super_user",
      defaultValue: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "user",
    tableName: "users",
  }
);

export default User;
