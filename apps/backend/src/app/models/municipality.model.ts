import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Association, NonAttribute, ForeignKey } from "sequelize";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import MunicipalityLanguage from "./municipalityLanguage.model";
import Article from "./article.model";
import Language from "./language.model";
import Province from "./province.model";
import Event from "./event.model";
import Podcast from "./podcast.model";

class Municipality extends Model<InferAttributes<Municipality>, InferCreationAttributes<Municipality>> {
  declare id: CreationOptional<string>;
  declare slug: string;
  declare provinceId: ForeignKey<string>;
  declare latitude: string;
  declare longitude: string;
  declare radius: number;
  declare radiusUnit: string;
  declare image?: string | null;
  declare mobileImage?: string | null;
  declare showFrontend: boolean;

  declare static associations: {
    municipalityLanguages: Association<Municipality, MunicipalityLanguage>;
    articles: Association<Municipality, Article>;
    events: Association<Municipality, Event>;
    podcasts: Association<Municipality, Podcast>;
    province: Association<Municipality, Province>;
  };

  declare municipalityLanguages?: NonAttribute<Array<MunicipalityLanguage>>;
  declare articles?: NonAttribute<Array<Article>>;
  declare events?: NonAttribute<Array<Event>>;
  declare podcasts?: NonAttribute<Array<Podcast>>;
  declare languages?: NonAttribute<Array<Language>>;
  declare province?: NonAttribute<Province>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Municipality.init(
  {
    id: {
      type: new DataTypes.STRING(10),
      primaryKey: true,
    },
    slug: {
      type: new DataTypes.STRING(100),
      allowNull: false,
    },
    provinceId: {
      type: new DataTypes.STRING(4),
      allowNull: false,
      field: "province_id",
    },
    latitude: {
      type: new DataTypes.DECIMAL(12, 7),
    },
    longitude: {
      type: new DataTypes.DECIMAL(12, 7),
    },
    radius: {
      type: DataTypes.INTEGER.UNSIGNED,
    },
    radiusUnit: {
      type: new DataTypes.STRING(2),
      field: "radius_unit",
    },
    image: {
      type: new DataTypes.STRING(255),
      allowNull: true,
    },
    mobileImage: {
      type: new DataTypes.STRING(255),
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
    sequelize: sequelizeConnector,
    modelName: "Municipality",
    tableName: "municipalities",
  }
);

export default Municipality;
