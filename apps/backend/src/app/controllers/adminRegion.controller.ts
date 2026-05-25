import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { Op, Transaction } from "sequelize";
import {
  adminRegionListSchema,
  adminRegionSchema,
  adminRegionCreateSchema,
  adminRegionEditSchema,
  adminRegionDeleteSchema,
  adminRegionLanguages,
} from "../schemas/adminRegion.schema";
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_SERVER_ERROR,
} from "../../config/httpStatus.config";
import { Region, RegionLanguage, Language } from "../models";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import randomString from "../../utils/randomString";
import slugifyService from "../services/slugify.service";
import { deleteUploadedFile, saveUploadedFile } from "../../utils/upload";
import config from "../../config/app.config";

const adminRegionController: FastifyPluginAsyncZod<IBaseRoute> = async (app, { routePrefix }) => {
  const getInstance = async (id: string, t?: Transaction) => {
    return await Region.findByPk(id, {
      include: [
        {
          model: RegionLanguage,
          as: "regionLanguages",
          include: [
            {
              model: Language,
              as: "language",
            },
          ],
        },
      ],
      transaction: t,
    });
  };

  const imageUrlBase = (slug: string, imageFileName: string) => ({
    src: `${config.serverNameStatics}/uploads/images/regions/${imageFileName || ""}`,
    title: slug,
  });

  app.get(routePrefix, { schema: adminRegionListSchema, preParsing: app.permGuard("admin.regions.list") }, async (request, reply) => {
    const { rangeFirst, rangeLast, sortBy, sortOrder, filter } = request.query;
    const filters: { name?: string; q?: string } = JSON.parse(filter);

    const { count, rows } = await Region.findAndCountAll({
      offset: rangeFirst,
      limit: rangeLast - rangeFirst + 1,
      order: [[sortBy, sortOrder]],
      include: [
        {
          association: "regionLanguages",
          ...(filters.q || filters.name
            ? { where: { name: { [Op.like]: `%${filters.q || filters.name}%` } }, required: true }
            : { required: false, separate: true }),
        },
      ],
      distinct: true,
    });

    const currentLocale = await app.currentLocale(request);

    return reply.code(HTTP_STATUS_OK).send({
      data: rows.map((item) => {
        const language = (item.regionLanguages || []).find((regionLanguage) => regionLanguage.languageId === currentLocale);
        return {
          id: item.id,
          name: language ? language.name : config.noNameDefault,
        };
      }),
      total: count,
    });
  });

  app.get(`${routePrefix}/:id`, { schema: adminRegionSchema, preParsing: app.permGuard("admin.regions.show") }, async (request, reply) => {
    const { id } = request.params;
    const instance = await getInstance(id);

    if (!instance) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }

    const response = {
      id: instance.id,
      slug: instance.slug,
      image: instance.image ? imageUrlBase(instance.slug, instance.image) : null,
      mobileImage: instance.mobileImage ? imageUrlBase(instance.slug, instance.mobileImage) : null,
      showFrontend: instance.showFrontend,
      regionLanguages: {} as Record<
        string,
        {
          langId: string;
          name: string;
          description: string;
        }
      >,
    };

    for (const lang of instance.regionLanguages || []) {
      response.regionLanguages[lang.languageId] = {
        langId: lang.languageId,
        name: lang.name,
        description: lang.description,
      };
    }

    return reply.code(HTTP_STATUS_OK).send(response);
  });

  app.post(routePrefix, { schema: adminRegionCreateSchema, preParsing: app.permGuard("admin.regions.create") }, async (request, reply) => {
    try {
      const { id, image, mobileImage, regionLanguages, showFrontend } = request.body;

      const instance = await sequelizeConnector.transaction(async (t) => {
        // Create main record
        const record = await Region.create(
          {
            id,
            slug: randomString(),
            image: randomString(),
            showFrontend: app.permGuardCheck("admin.regions.field.show_frontend") ? showFrontend ?? false : false,
          },
          { transaction: t }
        );

        // Set slug and image from default language
        const defaultIsoCode = await app.defaultIsoCode(t);
        const defaultLang = regionLanguages[defaultIsoCode];
        record.slug = slugifyService(`${defaultLang.name} ${record.id}`);
        if (image) {
          record.image = await saveUploadedFile(image, ["images", "regions"], `${record.slug}-${Date.now()}`);
        } else {
          record.image = null;
        }
        if (mobileImage) {
          record.mobileImage = await saveUploadedFile(mobileImage, ["images", "regions"], `${record.slug}-mobile-${Date.now()}`);
        } else {
          record.mobileImage = null;
        }
        await record.save({ transaction: t });

        // Create language entries
        for (const isoCode in regionLanguages) {
          const lang = regionLanguages[isoCode];
          await RegionLanguage.create(
            {
              regionId: record.id,
              languageId: lang.langId,
              name: lang.name,
              description: lang.description!,
            },
            { transaction: t }
          );
        }

        return record;
      });

      return reply.code(HTTP_STATUS_CREATED).send({
        id: instance.id,
        slug: instance.slug,
        image: instance.image ? imageUrlBase(instance.slug, instance.image) : null,
        mobileImage: instance.mobileImage ? imageUrlBase(instance.slug, instance.mobileImage) : null,
        showFrontend: instance.showFrontend,
        regionLanguages,
      });
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  app.put(`${routePrefix}/:id`, { schema: adminRegionEditSchema, preParsing: app.permGuard("admin.regions.edit") }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { slug, image, mobileImage, showFrontend, regionLanguages } = request.body;

      const instance = await sequelizeConnector.transaction(async (t) => {
        const record = await getInstance(id, t);
        if (!record) return null;

        // Update main record
        record.slug = slug!;
        record.showFrontend = app.permGuardCheck("admin.regions.field.show_frontend") ? showFrontend ?? false : record.showFrontend;

        if (image) {
          if (record.image) deleteUploadedFile(record.image, ["images", "regions"]);
          record.image = await saveUploadedFile(image, ["images", "regions"], `${slug}-${Date.now()}`);
        } else if (image === null && record.image) {
          //TO DO: See if we can send from frontend null if user deleted image
          //deleteUploadedFile(record.image, ["images", "regions"]);
          record.image = null;
        }
        if (mobileImage) {
          if (record.mobileImage) deleteUploadedFile(record.mobileImage, ["images", "regions"]);
          record.mobileImage = await saveUploadedFile(mobileImage, ["images", "regions"], `${slug}-mobile-${Date.now()}`);
        } else if (mobileImage === null && record.mobileImage) {
          //TO DO: See if we can send from frontend null if user deleted image
          //deleteUploadedFile(record.mobileImage, ["images", "regions"]);
          record.mobileImage = null;
        }

        await record.save({ transaction: t });

        // Replace language entries
        await RegionLanguage.destroy({ where: { regionId: record.id }, transaction: t });

        for (const isoCode in regionLanguages) {
          const lang = regionLanguages[isoCode];
          await RegionLanguage.create(
            {
              regionId: record.id,
              languageId: lang.langId,
              name: lang.name,
              description: lang.description!,
            },
            { transaction: t }
          );
        }

        return record;
      });

      if (!instance) {
        return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
      }

      return reply.code(HTTP_STATUS_OK).send({
        id: instance.id,
        slug: instance.slug,
        image: instance.image ? imageUrlBase(instance.slug, instance.image) : null,
        mobileImage: instance.mobileImage ? imageUrlBase(instance.slug, instance.mobileImage) : null,
        showFrontend: instance.showFrontend,
        regionLanguages,
      });
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  app.delete(`${routePrefix}/:id`, { schema: adminRegionDeleteSchema, preParsing: app.permGuard("admin.regions.delete") }, async (request, reply) => {
    try {
      const { id } = request.params;

      const instance = await sequelizeConnector.transaction(async (t) => {
        const record = await getInstance(id, t);
        if (!record) {
          return null;
        } else {
          // Clean up image before deleting record
          if (record.image) {
            deleteUploadedFile(record.image, ["images", "regions"]);
          }
          await record.destroy({ transaction: t });
        }
        return record;
      });

      if (!instance) {
        return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
      } else {
        return reply.code(HTTP_STATUS_NO_CONTENT).send(true);
      }
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });
};

export default adminRegionController;
