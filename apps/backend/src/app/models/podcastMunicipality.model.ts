import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Association, NonAttribute } from "sequelize";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import Podcast from "./podcast.model";
import Municipality from "./municipality.model";

class PodcastMunicipality extends Model<InferAttributes<PodcastMunicipality>, InferCreationAttributes<PodcastMunicipality>> {
  declare podcastId: number;
  declare municipalityId: string;

  declare static associations: {
    podcast: Association<PodcastMunicipality, Podcast>;
    municipality: Association<PodcastMunicipality, Municipality>;
  };

  declare podcast?: NonAttribute<Podcast>;
  declare municipality?: NonAttribute<Municipality>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

PodcastMunicipality.init(
  {
    podcastId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: "podcast_id",
    },
    municipalityId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      field: "municipality_id",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: sequelizeConnector,
    modelName: "PodcastMunicipality",
    tableName: "podcasts_municipalities",
  }
);

export default PodcastMunicipality; 