import { Model, DataTypes, CreationOptional } from "sequelize";
import sequelizeConnector from "../../config/sequelizeConnector.config";

class Settings extends Model {
  declare id: string;
  declare value: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Settings.init(
  {
    id: {
      type: new DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    value: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: sequelizeConnector,
    modelName: "Settings",
    tableName: "settings",
  }
);

export default Settings; 