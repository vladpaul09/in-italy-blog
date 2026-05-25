import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Association, NonAttribute, ForeignKey } from "sequelize";
import sequelize from "../../config/sequelizeConnector.config";
import User from "./user.model";
import Category from "./category.model";
import Municipality from "./municipality.model";
import PodcastLanguage from "./podcastLanguage.model";
import PostScope from "../../entries/postScope.entry";
import UserAlias from "./userAlias.model";

class Podcast extends Model<InferAttributes<Podcast>, InferCreationAttributes<Podcast>> {
  declare id: CreationOptional<number>;
  declare slug: string;
  declare userId: ForeignKey<number>;
  declare userReviewId: ForeignKey<number> | null;
  declare image?: string | null;
  declare mobileImage?: string | null;
  declare youtubeLink: string;
  declare latitude: string | null;
  declare longitude: string | null;
  declare scope: PostScope;
  declare publish: boolean;
  declare authorId: ForeignKey<number> | null;
  declare authorAliasId: ForeignKey<number> | null;

  declare static associations: {
    podcastLanguages: Association<Podcast, PodcastLanguage>;
    user: Association<Podcast, User>;
    userReview: Association<Podcast, User>;
    categories: Association<Podcast, Category>;
    municipalities: Association<Podcast, Municipality>;
    author: Association<Podcast, User>;
    authorAlias: Association<Podcast, UserAlias>;
  };

  declare podcastLanguages?: NonAttribute<Array<PodcastLanguage>>;
  declare user?: NonAttribute<User>;
  declare author?: NonAttribute<User>;
  declare categories?: NonAttribute<Array<Category>>;
  declare municipalities?: NonAttribute<Array<Municipality>>;
  declare authorAlias?: NonAttribute<UserAlias>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Podcast.init(
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
    youtubeLink: {
      type: DataTypes.TEXT,
      field: "youtube_link",
    },
    latitude: {
      type: new DataTypes.DECIMAL(12, 7),
      allowNull: true,
    },
    longitude: {
      type: new DataTypes.DECIMAL(12, 7),
      allowNull: true,
    },
    scope: {
      type: DataTypes.ENUM(...Object.values(PostScope)),
      allowNull: false,
      defaultValue: PostScope.EVERYWHERE,
    },
    publish: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    authorId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
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
    modelName: "Podcast",
    tableName: "podcasts",
  }
);

export default Podcast;
