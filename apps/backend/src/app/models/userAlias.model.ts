import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey, NonAttribute } from "sequelize";
import sequelize from "../../config/sequelizeConnector.config";
import User from "./user.model";

class UserAlias extends Model<InferAttributes<UserAlias>, InferCreationAttributes<UserAlias>> {
  declare id: CreationOptional<number>;
  declare name: string;

  declare userId: ForeignKey<User["id"]>;
  declare user?: NonAttribute<User>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

UserAlias.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      field: "user_id",
      references: {
        model: User,
        key: "id",
      },
      onDelete: "RESTRICT",
    },
    name: {
      type: DataTypes.STRING(255),
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "userAlias",
    tableName: "users_aliases",
    timestamps: true,
  }
);

export default UserAlias;
