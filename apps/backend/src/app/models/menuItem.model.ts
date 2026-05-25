import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Association, NonAttribute, ForeignKey } from "sequelize";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import MenuItemLanguage from "./menuItemLanguage.model";
import { MenuItemType } from "../../entries/menuTypes.entry";
import Category from "./category.model";

class MenuItem extends Model<InferAttributes<MenuItem>, InferCreationAttributes<MenuItem>> {
  declare id: CreationOptional<number>;
  declare parentId: ForeignKey<number> | null;
  declare categoryId: number | null;
  declare url: string | null;
  declare icon: string | null;
  declare type: MenuItemType;
  declare isVisible: boolean;
  declare position: number;
  declare maxItems: number;

  static async getChildMenuItemsHierarchy(id: number | null): Promise<Array<MenuItem>> {
    // If id is null, we've reached the bottom level
    const menuItems = await MenuItem.findAll({
      where: {
        parentId: id,
        isVisible: true,
      },
      include: [
        {
          model: MenuItemLanguage,
          as: "menuItemLanguages",
          required: false,
        },
        {
          model: MenuItem,
          as: "parentMenuItem",
          required: false,
        },
      ],
      order: [["position", "ASC"]],
    });
    // For each menu item, recursively get its children
    return await Promise.all(
      menuItems.map(async (item) => {
        // Get children for this item
        const children = await MenuItem.getChildMenuItemsHierarchy(item.id);
        if (children.length > 0) {
          item.childMenuItems = children;
        }
        return item;
      })
    );
  }

  declare static associations: {
    parentMenuItem: Association<MenuItem, MenuItem>;
    menuItemLanguages: Association<MenuItem, MenuItemLanguage>;
    category: Association<MenuItem, Category>;
  };

  declare parentMenuItem?: NonAttribute<MenuItem | null>;
  declare childMenuItems?: NonAttribute<Array<MenuItem>>;
  declare menuItemLanguages?: NonAttribute<Array<MenuItemLanguage>>;
  declare category?: NonAttribute<Category | null>;

  // timestamps
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

MenuItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    parentId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: "parent_id",
      references: {
        model: "menu_items",
        key: "id",
      },
    },
    categoryId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: "category_id",
      references: {
        model: "categories",
        key: "id",
      },
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM(
        MenuItemType.LINK,
        MenuItemType.CATEGORY_ARTICLES,
        MenuItemType.CATEGORY_EVENTS,
        MenuItemType.TITLE,
        MenuItemType.DROPDOWN
      ),
      allowNull: false,
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_visible",
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    maxItems: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 3,
      field: "max_items",
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
    },
  },
  {
    sequelize: sequelizeConnector,
    modelName: "MenuItem",
    tableName: "menu_items",
  }
);

export default MenuItem;
