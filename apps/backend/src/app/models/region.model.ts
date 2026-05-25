import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Association, NonAttribute } from "sequelize";
import sequelize from "../../config/sequelizeConnector.config";
import RegionLanguage from "./regionLanguage.model";
import Language from "./language.model";
import Province from "./province.model";

class Region extends Model<InferAttributes<Region>, InferCreationAttributes<Region>> {
  declare id: CreationOptional<string>;
  declare slug: string;
  declare image?: string | null;
  declare mobileImage?: string | null;
  declare showFrontend: boolean;

  declare static associations: {
    regionLanguages: Association<Region, RegionLanguage>;
  };

  declare regionLanguages?: NonAttribute<Array<RegionLanguage>>;
  declare languages?: NonAttribute<Array<Language>>;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
  declare provinces?: NonAttribute<Array<Province>>;
}

Region.init(
  {
    id: {
      type: new DataTypes.STRING(2),
      primaryKey: true,
    },
    slug: {
      type: new DataTypes.STRING(100),
      unique: true,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    mobileImage: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "mobile_image",
    },
    showFrontend: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "show_frontend",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Region",
    tableName: "regions",
  }
);

export default Region;
