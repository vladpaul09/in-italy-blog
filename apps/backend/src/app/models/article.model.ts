import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Association, NonAttribute, ForeignKey } from "sequelize";
import sequelize from "../../config/sequelizeConnector.config";
import Municipality from "./municipality.model";
import User from "./user.model";
import Category from "./category.model";
import ArticleLanguage from "./articleLanguage.model";
import PostScope from "../../entries/postScope.entry";
import UserAlias from "./userAlias.model";

class Article extends Model<InferAttributes<Article>, InferCreationAttributes<Article>> {
  declare id: CreationOptional<number>;
  declare slug: string;
  declare userId: number;
  declare userReviewId: number | null;
  declare image?: string | null;
  declare mobileImage?: string | null;
  declare scope: PostScope;
  declare latitude: string | null;
  declare longitude: string | null;
  declare publish: boolean;
  declare authorId: ForeignKey<number>;
  declare authorAliasId: ForeignKey<number> | null;

  declare static associations: {
    articleLanguages: Association<Article, ArticleLanguage>;
    municipalities: Association<Article, Municipality>;
    user: Association<Article, User>;
    author: Association<Article, User>;
    authorAlias: Association<Article, UserAlias>;
    userReview: Association<Article, User>;
    categories: Association<Article, Category>;
  };

  declare articleLanguages?: NonAttribute<Array<ArticleLanguage>>;
  declare municipalities?: NonAttribute<Array<Municipality>>;
  declare user?: NonAttribute<User>;
  declare userReview?: NonAttribute<User>;
  declare categories?: NonAttribute<Array<Category>>;
  declare author?: NonAttribute<User>;
  declare authorAlias?: NonAttribute<UserAlias>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Article.init(
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
    userReviewId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: "user_review_id",
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
    scope: {
      type: DataTypes.ENUM(...Object.values(PostScope)),
      allowNull: false,
      defaultValue: PostScope.EVERYWHERE,
    },
    latitude: {
      type: new DataTypes.DECIMAL(12, 7),
      allowNull: true,
    },
    longitude: {
      type: new DataTypes.DECIMAL(12, 7),
      allowNull: true,
    },
    publish: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    authorId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: "author_id",
    },
    authorAliasId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: "author_alias_id",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Article",
    tableName: "articles",
  }
);

export default Article;
