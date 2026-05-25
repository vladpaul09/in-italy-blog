import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Association, NonAttribute } from "sequelize";
import sequelize from "../../config/sequelizeConnector.config";
import User from "./user.model";
import Article from "./article.model";
import Event from "./event.model";
import CategoryLanguage from "./categoryLanguage.model";
import Podcast from "./podcast.model";
import CategoriesType, { CategoryPageView } from "../../entries/categoriesType.entry";
import Tag from "./tag.model";

class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
  declare id: CreationOptional<number>;
  declare slug: string;
  declare userId: number;
  declare parentId: number | null;
  declare image?: string | null;
  declare mobileImage?: string | null;
  declare type: CategoriesType;
  declare pageView: CategoryPageView;

  static async getParentCategoriesHierarchy(id: number | null): Promise<Array<Category>> {
    // If id is null, we've reached the top level
    if (id === null) {
      return [];
    }

    // Get the current category
    const category = await Category.findByPk(id);

    if (!category) {
      return [];
    }

    // If this category has a parent, recursively get its parent
    if (category.parentId !== null) {
      const parent = await Category.getParentCategoriesHierarchy(category.parentId);
      return [...parent, category];
    }

    // If no parent (parentId is null), return just this category
    return [category];
  }

  static async getChildrenCategoriesHierarchy(id: number): Promise<Array<Category>> {
    // Get direct children of current category
    const children = await Category.findAll({ where: { parentId: id } });

    if (!children) return [];
    if (children.length === 0) return [];

    // Get all descendants recursively
    const descendants = await Promise.all(
      children.map(async (child) => {
        const childDescendants = await Category.getChildrenCategoriesHierarchy(child.id);
        return [child, ...childDescendants];
      })
    );

    // Flatten the array of arrays and return all descendants
    return descendants.reduce((acc, val) => acc.concat(val), []);
  }

  declare static associations: {
    user: Association<Category, User>;
    categoryArticles: Association<Category, Article>;
    categoryLanguages: Association<Category, CategoryLanguage>;
    parentCategory: Association<Category, Category>;
    childCategories: Association<Category, Category>;
    categoryPodcasts: Association<Category, Podcast>;
    categoryEvents: Association<Category, Event>;
    tags: Association<Category, Tag>;
  };

  declare user?: NonAttribute<User>;
  declare categoryArticles?: NonAttribute<Array<Article>>;
  declare categoryLanguages?: NonAttribute<Array<CategoryLanguage>>;
  declare parentCategory?: NonAttribute<Category>;
  declare childCategories?: NonAttribute<Array<Category>>;
  declare categoryPodcasts?: NonAttribute<Array<Podcast>>;
  declare categoryEvents?: NonAttribute<Array<Event>>;
  declare tags?: NonAttribute<Array<Tag>>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Category.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: "user_id",
    },
    parentId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: "parent_id",
    },
    type: {
      type: DataTypes.ENUM(CategoriesType.ARTICLES, CategoriesType.EVENTS, CategoriesType.PODCASTS),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobileImage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "mobile_image",
    },
    pageView: {
      field: "page_view",
      type: DataTypes.ENUM(CategoryPageView.POSTS_VIEW, CategoryPageView.REGIONAL_VIEW, CategoryPageView.PARENT_CATEGORY_VIEW),
      allowNull: false,
      defaultValue: CategoryPageView.POSTS_VIEW,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "categories",
  }
);

export default Category;
