import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Association, NonAttribute, ForeignKey } from "sequelize";
import sequelize from "../../config/sequelizeConnector.config";
import Language from "./language.model";

class PushSubscription extends Model<InferAttributes<PushSubscription>, InferCreationAttributes<PushSubscription>> {
  declare id: CreationOptional<number>;
  declare endpoint: string;
  declare p256dhKey: string;
  declare authKey: string;
  declare expirationTime: string | null;
  declare userAgent: string | null;
  declare ipAddress: string | null;
  declare locale: ForeignKey<Language['id']>;
  declare latitude: number | null;
  declare longitude: number | null;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Associations
  declare language?: NonAttribute<Language>;
  declare static associations: {
    language: Association<PushSubscription, Language>;
  };
}

PushSubscription.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    endpoint: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    p256dhKey: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "p256dh_key",
    },
    authKey: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "auth_key",
    },
    expirationTime: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "expiration_time",
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "user_agent",
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: "ip_address",
    },
    locale: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "it",
      references: {
        model: Language,
        key: "id",
      },
    },
    latitude: {
      type: DataTypes.DECIMAL(12, 7),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(12, 7),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "PushSubscription",
    tableName: "push_subscriptions",
    timestamps: true,
    underscored: false,
  }
);

export default PushSubscription;
