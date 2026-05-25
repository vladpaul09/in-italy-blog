import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Association, NonAttribute, ForeignKey } from "sequelize";
import sequelize from "../../config/sequelizeConnector.config";
import ProvinceLanguage from "./provinceLanguage.model";
import Language from "./language.model";
import Region from "./region.model";
import Municipality from "./municipality.model";

class Province extends Model<InferAttributes<Province>, InferCreationAttributes<Province>> {
  declare id: string;
  declare slug: string;
  declare code: string;
  declare regionId: ForeignKey<string>;
  declare image?: string | null;
  declare mobileImage?: string | null;
  declare showFrontend: boolean;

  declare static associations: {
    provinceLanguages: Association<Province, ProvinceLanguage>;
    region: Association<Province, Region>;
  };

  declare languages?: NonAttribute<Array<Language>>;

  declare provinceLanguages?: NonAttribute<Array<ProvinceLanguage>>;

  declare region?: NonAttribute<Region>;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
  declare municipalities?: NonAttribute<Array<Municipality>>;
}

Province.init(
  {
    id: {
      type: new DataTypes.STRING(4),
      primaryKey: true,
    },
    slug: {
      type: new DataTypes.STRING(100),
      unique: true,
    },
    code: {
      type: new DataTypes.STRING(10),
    },
    regionId: {
      type: new DataTypes.STRING(2),
      allowNull: false,
      field: "region_id",
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
    modelName: "Province",
    tableName: "provinces",
  }
);

export default Province;
