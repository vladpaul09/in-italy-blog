import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey } from "sequelize";
import sequelizeConnector from "../../config/sequelizeConnector.config";

class TagLanguage extends Model<InferAttributes<TagLanguage>, InferCreationAttributes<TagLanguage>> {
  declare tagId: ForeignKey<number>;
  declare languageId: ForeignKey<string>;
  declare name: string;
  declare description: string | null;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

TagLanguage.init(
  {
    tagId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: "tag_id",
    },
    languageId: {
      type: DataTypes.STRING(2),
      allowNull: false,
      primaryKey: true,
      field: "language_id",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: sequelizeConnector,
    modelName: "TagLanguage",
    tableName: "tag_languages",
  }
);

export default TagLanguage;
