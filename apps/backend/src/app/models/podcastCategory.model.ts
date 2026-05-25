import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Association, NonAttribute } from "sequelize";
import sequelizeConnector from "../../config/sequelizeConnector.config";

class PodcastCategory extends Model<InferAttributes<PodcastCategory>, InferCreationAttributes<PodcastCategory>> {
  declare podcastId: number;
  declare categoryId: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

PodcastCategory.init(
  {
    podcastId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: "podcast_id",
    },
    categoryId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: "category_id",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: sequelizeConnector,
    modelName: "PodcastCategory",
    tableName: "podcasts_categories",
  }
);

export default PodcastCategory;
