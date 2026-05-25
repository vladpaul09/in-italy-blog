import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Association, NonAttribute } from "sequelize";
import sequelize from "../../config/sequelizeConnector.config";
import Category from "./category.model";
import TagLanguage from "./tagLanguage.model";

class Tag extends Model<InferAttributes<Tag>, InferCreationAttributes<Tag>> {
  declare id: CreationOptional<number>;
  declare slug: string;
  declare mapMarkerImage: string | null;

  declare static associations: {
    tagLanguages: Association<Tag, TagLanguage>;
    categories: Association<Tag, Category>;
  };

  declare tagLanguages?: NonAttribute<Array<TagLanguage>>;
  declare categories?: NonAttribute<Array<Category>>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Tag.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    mapMarkerImage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "map_marker_image",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Tag",
    tableName: "tags",
  }
);

export default Tag;

