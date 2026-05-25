import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Association, NonAttribute } from "sequelize";
import sequelize from "../../config/sequelizeConnector.config";
import Language from "./language.model";

class I18n extends Model<InferAttributes<I18n>, InferCreationAttributes<I18n>> {
  declare id: string;
  declare langId: string;
  declare value: string;

  declare static associations: {
    language: Association<I18n, Language>;
  };

  declare language?: NonAttribute<Language>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

I18n.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    langId: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
      field: "lang_id",
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "I18n",
    tableName: "i18n",
  }
);

export default I18n; 