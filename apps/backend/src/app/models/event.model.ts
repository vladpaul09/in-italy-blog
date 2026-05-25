import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Association, NonAttribute, ForeignKey } from "sequelize";
import sequelize from "../../config/sequelizeConnector.config";
import Municipality from "./municipality.model";
import User from "./user.model";
import Category from "./category.model";
import EventLanguage from "./eventLanguage.model";
import UserAlias from "./userAlias.model";

class Event extends Model<InferAttributes<Event>, InferCreationAttributes<Event>> {
  declare id: CreationOptional<number>;
  declare slug: string;
  declare userId: ForeignKey<number>;
  declare userReviewId: ForeignKey<number> | null;
  declare image?: string | null;
  declare mobileImage?: string | null;
  declare startDate: Date;
  declare endDate: Date;
  declare latitude: string | null;
  declare longitude: string | null;
  declare municipalityId: string;
  declare publish: boolean;
  declare authorId: ForeignKey<number>;
  declare authorAliasId: ForeignKey<number> | null;

  declare static associations: {
    eventLanguages: Association<Event, EventLanguage>;
    municipality: Association<Event, Municipality>;
    user: Association<Event, User>;
    userReview: Association<Event, User>;
    categories: Association<Event, Category>;
    author: Association<Event, User>;
    authorAlias: Association<Event, UserAlias>;
  };

  declare eventLanguages?: NonAttribute<Array<EventLanguage>>;
  declare municipality?: NonAttribute<Municipality>;
  declare user?: NonAttribute<User>;
  declare userReview?: NonAttribute<User>;
  declare categories?: NonAttribute<Array<Category>>;
  declare author?: NonAttribute<User>;
  declare authorAlias?: NonAttribute<UserAlias>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Event.init(
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
    latitude: {
      type: new DataTypes.DECIMAL(12, 7),
      allowNull: true,
    },
    longitude: {
      type: new DataTypes.DECIMAL(12, 7),
      allowNull: true,
    },
    municipalityId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "municipality_id",
      references: {
        model: "municipalities",
        key: "id",
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "start_date",
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "end_date",
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
    modelName: "Event",
    tableName: "events",
  }
);

export default Event;
