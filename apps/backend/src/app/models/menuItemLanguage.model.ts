import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, NonAttribute, Association } from "sequelize";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import Language from "./language.model";
import MenuItem from "./menuItem.model";

class MenuItemLanguage extends Model<InferAttributes<MenuItemLanguage>, InferCreationAttributes<MenuItemLanguage>> {
  declare menuItemId: number;
  declare languageId: string;
  declare title: string;

  declare static associations: {
    menuItem: Association<MenuItemLanguage, MenuItem>;
    language: Association<MenuItemLanguage, Language>;
  };

  declare menuItem?: NonAttribute<MenuItem>;
  declare language?: NonAttribute<Language>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

MenuItemLanguage.init(
  {
    menuItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: "menu_item_id",
    },
    languageId: {
      type: new DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
      field: "language_id",
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  },
  {
    sequelize: sequelizeConnector,
    modelName: "MenuItemLanguage",
    tableName: "menu_item_languages",
  }
);

export default MenuItemLanguage; 