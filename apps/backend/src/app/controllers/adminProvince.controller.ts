import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { Op, Transaction } from "sequelize";
import {
  adminProvinceListSchema,
  adminProvinceSchema,
  adminProvinceCreateSchema,
  adminProvinceEditSchema,
  adminProvinceDeleteSchema,
} from "../schemas/adminProvince.schema";
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_SERVER_ERROR,
} from "../../config/httpStatus.config";
import { Province, ProvinceLanguage, Language } from "../models";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import config from "../../config/app.config";
import { deleteUploadedFile, saveUploadedFile } from "../../utils/upload";
import randomString from "../../utils/randomString";
import slugifyService from "../services/slugify.service";

const adminProvinceController: FastifyPluginAsyncZod<IBaseRoute> = async (app, { routePrefix }) => {
  const getInstance = async (id: string, t?: Transaction) => {
    return await Province.findByPk(id, {
      include: [
        {
          model: ProvinceLanguage,
          as: "provinceLanguages",
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
    src: `${config.serverNameStatics}/uploads/images/provinces/${imageFileName || ""}`,
    title: slug,
  });

  app.get(routePrefix, { schema: adminProvinceListSchema, preParsing: app.permGuard("admin.provinces.list") }, async (request, reply) => {
    const { rangeFirst, rangeLast, sortBy, sortOrder, filter } = request.query;
    const filters: { name?: string; q?: string; regionId?: number } = JSON.parse(filter);

    const { count, rows } = await Province.findAndCountAll({
      where: { ...(filters.regionId ? { regionId: filters.regionId } : {}) },
      offset: rangeFirst,
      limit: rangeLast - rangeFirst + 1,
      order: [[sortBy, sortOrder]],
      include: [
        {
          association: "provinceLanguages",
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
        const language = (item.provinceLanguages || []).find((provinceLanguage) => provinceLanguage.languageId === currentLocale);
        return {
          id: item.id,
          name: language ? language.name : config.noNameDefault,
          regionId: item.regionId,
        };
      }),
      total: count,
    });
  });

  app.get(`${routePrefix}/:id`, { schema: adminProvinceSchema, preParsing: app.permGuard("admin.provinces.show") }, async (request, reply) => {
    const { id } = request.params;

    const instance = await Province.findByPk(id, {
      include: [
        {
          model: ProvinceLanguage,
          as: "provinceLanguages",
        },
      ],
    });

    if (!instance) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }

    const response = {
      id: instance.id,
      slug: instance.slug,
      code: instance.code,
      regionId: instance.regionId,
      image: instance.image ? imageUrlBase(instance.slug, instance.image) : null,
      mobileImage: instance.mobileImage ? imageUrlBase(instance.slug, instance.mobileImage) : null,
      showFrontend: instance.showFrontend,
      provinceLanguages: {} as Record<
        string,
        {
          langId: string;
          name: string;
          description: string;
        }
      >,
    };

    for (const lang of instance.provinceLanguages || []) {
      response.provinceLanguages[lang.languageId] = {
        langId: lang.languageId,
        name: lang.name,
        description: lang.description,
      };
    }

    return reply.code(HTTP_STATUS_OK).send(response);
  });

  app.post(routePrefix, { schema: adminProvinceCreateSchema, preParsing: app.permGuard("admin.provinces.create") }, async (request, reply) => {
    try {
      const { id, regionId, code, image, mobileImage, showFrontend, provinceLanguages } = request.body;

      const instance = await sequelizeConnector.transaction(async (t) => {
        // Create main record
        const record = await Province.create(
          {
            id,
            slug: randomString(),
            code,
            regionId: regionId,
            image: randomString(),
            showFrontend: app.permGuardCheck("admin.provinces.field.show_frontend") ? showFrontend ?? false : false,
          },
          { transaction: t }
        );

        // Set slug and image from default language
        const defaultIsoCode = await app.defaultIsoCode(t);
        const defaultLang = provinceLanguages[defaultIsoCode];
        record.slug = slugifyService(`${defaultLang.name} ${record.id}`);
        if (image) {
          record.image = await saveUploadedFile(image, ["images", "provinces"], `${record.slug}-${Date.now()}`);
        } else {
          record.image = null;
        }
        if (mobileImage) {
          record.mobileImage = await saveUploadedFile(mobileImage, ["images", "provinces"], `${record.slug}-mobile-${Date.now()}`);
        } else {
          record.mobileImage = null;
        }
        await record.save({ transaction: t });

        // Create language entries
        for (const isoCode in provinceLanguages) {
          const lang = provinceLanguages[isoCode];
          await ProvinceLanguage.create(
            {
              provinceId: record.id,
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
        code: instance.code,
        regionId: instance.regionId,
        image: instance.image ? imageUrlBase(instance.slug, instance.image) : null,
        mobileImage: instance.mobileImage ? imageUrlBase(instance.slug, instance.mobileImage) : null,
        showFrontend: instance.showFrontend,
        provinceLanguages,
      });
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  app.put(`${routePrefix}/:id`, { schema: adminProvinceEditSchema, preParsing: app.permGuard("admin.provinces.edit") }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { slug, regionId, code, image, mobileImage, showFrontend, provinceLanguages } = request.body;

      const instance = await sequelizeConnector.transaction(async (t) => {
        const record = await getInstance(id, t);
        if (!record) return null;

        // Update main record
        record.slug = slug;
        record.code = code;
        record.regionId = regionId;
        record.showFrontend = app.permGuardCheck("admin.provinces.field.show_frontend") ? showFrontend ?? false : record.showFrontend;

        if (image) {
          if (record.image) deleteUploadedFile(record.image, ["images", "provinces"]);
          record.image = await saveUploadedFile(image, ["images", "provinces"], `${slug}-${Date.now()}`);
        } else if (image === null && record.image) {
          //TO DO: See if we can send from frontend null if user deleted image
          //deleteUploadedFile(record.image, ["images", "provinces"]);
          record.image = null;
        }
        if (mobileImage) {
          if (record.mobileImage) deleteUploadedFile(record.mobileImage, ["images", "provinces"]);
          record.mobileImage = await saveUploadedFile(mobileImage, ["images", "provinces"], `${slug}-mobile-${Date.now()}`);
        } else if (mobileImage === null && record.mobileImage) {
          //TO DO: See if we can send from frontend null if user deleted image
          //deleteUploadedFile(record.mobileImage, ["images", "provinces"]);
          record.mobileImage = null;
        }

        await record.save({ transaction: t });

        // Replace language entries
        await ProvinceLanguage.destroy({ where: { provinceId: record.id }, transaction: t });

        for (const isoCode in provinceLanguages) {
          const lang = provinceLanguages[isoCode];
          await ProvinceLanguage.create(
            {
              provinceId: record.id,
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
        code: instance.code,
        regionId: instance.regionId,
        image: instance.image ? imageUrlBase(instance.slug, instance.image) : null,
        mobileImage: instance.mobileImage ? imageUrlBase(instance.slug, instance.mobileImage) : null,
        showFrontend: instance.showFrontend,
        provinceLanguages,
      });
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  app.delete(
    `${routePrefix}/:id`,
    { schema: adminProvinceDeleteSchema, preParsing: app.permGuard("admin.provinces.delete") },
    async (request, reply) => {
      try {
        const { id } = request.params;

        const instance = await sequelizeConnector.transaction(async (t) => {
          const record = await getInstance(id, t);
          if (!record) {
            return null;
          }

          if (record.image) {
            deleteUploadedFile(record.image, ["images", "provinces"]);
          }
          await record.destroy({ transaction: t });
          return record;
        });

        if (!instance) {
          return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
        }
        return reply.code(HTTP_STATUS_NO_CONTENT).send(true);
      } catch (error) {
        return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
      }
    }
  );
};

export default adminProvinceController;
