import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from "sequelize";
import sequelize from "../../config/sequelizeConnector.config";

class Media extends Model<InferAttributes<Media>, InferCreationAttributes<Media>> {
  declare id: string;

  getName(): string {
    return this.id;
  }

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Media.init(
  {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Media",
    tableName: "media",
  }
);

export default Media;
