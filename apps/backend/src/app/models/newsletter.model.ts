import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from "sequelize";
import sequelize from "../../config/sequelizeConnector.config";

class Newsletter extends Model<InferAttributes<Newsletter>, InferCreationAttributes<Newsletter>> {
  declare id: CreationOptional<number>;
  declare email: string;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

Newsletter.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: new DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "newsletter",
    tableName: "newsletters",
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
    ],
  }
);

export default Newsletter;
