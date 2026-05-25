import { FastifyPluginAsync, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { Transaction } from "sequelize";
import Language from "../app/models/language.model";

// using declaration merging, add your plugin props to the appropriate fastify interfaces
// if prop type is defined here, the value will be typechecked when you call decorate{,Request,Reply}
declare module "fastify" {
  interface FastifyInstance {
    defaultIsoCode: (transaction?: Transaction) => Promise<string>;
    currentLocale: (request: FastifyRequest, transaction?: Transaction) => Promise<string>;
    getRequestLocale: (requestLocale: string, transaction?: Transaction) => Promise<string>;
  }
}

const i18nLocale: FastifyPluginAsync<{ fallbackLocale: string }> = async (fastify, { fallbackLocale }) => {
  const defaultLanguage = async (transaction?: Transaction) => await Language.findOne({ where: { default: true, status: true }, transaction: transaction });

  fastify.decorate("defaultIsoCode", async (transaction?: Transaction) => {
    const language = await defaultLanguage(transaction);
    return language ? language.id : fallbackLocale;
  });

  fastify.decorate("currentLocale", async (request: FastifyRequest, transaction?: Transaction) => {
    const language = await defaultLanguage(transaction);
    return request.i18n.currentLocale ?? (language ? language.id : fallbackLocale);
  });

  fastify.decorate("getRequestLocale", async (requestLocale: string, transaction?: Transaction) => {
    const activeLang = await Language.findOne({
      where: {
        id: requestLocale,
        status: true,
      },
      transaction: transaction,
    });
    if (activeLang) return requestLocale;

    const language = await defaultLanguage(transaction);
    return language ? language.id : fallbackLocale;
  });
};

export default fp(i18nLocale);
