import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from "sequelize";
import sequelizeConnector from "../../config/sequelizeConnector.config";

class CategoryTag extends Model<InferAttributes<CategoryTag>, InferCreationAttributes<CategoryTag>> {
  declare categoryId: number;
  declare tagId: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

CategoryTag.init(
  {
    categoryId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: "category_id",
    },
    tagId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: "tag_id",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: sequelizeConnector,
    modelName: "CategoryTag",
    tableName: "categories_tags",
  }
);

export default CategoryTag;
