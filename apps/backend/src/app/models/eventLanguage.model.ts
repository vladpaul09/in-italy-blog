import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, NonAttribute, Association } from "sequelize";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import Language from "./language.model";

class EventLanguage extends Model<InferAttributes<EventLanguage>, InferCreationAttributes<EventLanguage>> {
  declare eventId: number;
  declare languageId: string;
  declare title: string;
  declare description?: string | null;

  declare static associations: {
    language: Association<EventLanguage, Language>;
  };

  declare language?: NonAttribute<Language>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

EventLanguage.init(
  {
    eventId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: "event_id",
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
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: sequelizeConnector,
    modelName: "EventLanguage",
    tableName: "events_languages",
  }
);

export default EventLanguage; 