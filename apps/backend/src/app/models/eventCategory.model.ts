import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from "sequelize";
import sequelizeConnector from "../../config/sequelizeConnector.config";

class EventCategory extends Model<InferAttributes<EventCategory>, InferCreationAttributes<EventCategory>> {
  declare eventId: number;
  declare categoryId: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

EventCategory.init(
  {
    eventId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: "event_id",
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
    modelName: "EventCategory",
    tableName: "events_categories",
  }
);

export default EventCategory; 