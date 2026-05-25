import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, NonAttribute, Association } from "sequelize";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import Language from "./language.model";

class PodcastLanguage extends Model<InferAttributes<PodcastLanguage>, InferCreationAttributes<PodcastLanguage>> {
  declare podcastId: number;
  declare languageId: string;
  declare title: string;
  declare shortDescription: string;
  declare description?: string;

  declare static associations: {
    language: Association<PodcastLanguage, Language>;
  };

  declare language?: NonAttribute<Language>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

PodcastLanguage.init(
  {
    podcastId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: "podcast_id",
    },
    languageId: {
      type: new DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
      field: "language_id",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortDescription: {
      type: DataTypes.STRING,
      field: "short_description",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: sequelizeConnector,
    modelName: "PodcastLanguage",
    tableName: "podcasts_languages",
  }
);

export default PodcastLanguage;
