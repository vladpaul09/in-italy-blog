import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from "sequelize";
import sequelize from "../../config/sequelizeConnector.config";

class Language extends Model<InferAttributes<Language>, InferCreationAttributes<Language>> {
  declare id: string;
  declare name: string;
  declare default: boolean;
  declare status: boolean;
  declare image: string;
  declare sortOrder: number;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

Language.init(
  {
    id: {
      type: new DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    image: {
      type: new DataTypes.STRING(255),
    },
    sortOrder: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      field: "sort_order",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Language",
    tableName: "languages",
  }
);

export default Language;
