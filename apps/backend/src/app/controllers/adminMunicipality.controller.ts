import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { Op, Transaction } from "sequelize";
import {
  adminMunicipalityListSchema,
  adminMunicipalitySchema,
  adminMunicipalityCreateSchema,
  adminMunicipalityEditSchema,
  adminMunicipalityDeleteSchema,
} from "../schemas/adminMunicipality.schema";
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_SERVER_ERROR,
} from "../../config/httpStatus.config";
import { Municipality, MunicipalityLanguage, Language } from "../models";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import randomString from "../../utils/randomString";
import slugifyService from "../services/slugify.service";
import { deleteUploadedFile, saveUploadedFile } from "../../utils/upload";
import config from "../../config/app.config";

const adminMunicipalityController: FastifyPluginAsyncZod<IBaseRoute> = async (app, { routePrefix }) => {
  const getInstance = async (id: string, t?: Transaction) => {
    return await Municipality.findByPk(id, {
      include: [
        {
          model: MunicipalityLanguage,
          as: "municipalityLanguages",
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
    src: `${config.serverNameStatics}/uploads/images/municipalities/${imageFileName || ""}`,
    title: slug,
  });

  app.get(routePrefix, { schema: adminMunicipalityListSchema, preParsing: app.permGuard("admin.municipalities.list") }, async (request, reply) => {
    const { rangeFirst, rangeLast, sortBy, sortOrder, filter } = request.query;
    const filters: { name?: string; q?: string; provinceId?: number } = JSON.parse(filter);

    const { count, rows } = await Municipality.findAndCountAll({
      where: { ...(filters.provinceId ? { provinceId: filters.provinceId } : {}) },
      offset: rangeFirst,
      limit: rangeLast - rangeFirst + 1,
      order: [[sortBy, sortOrder]],
      include: [
        {
          association: "municipalityLanguages",
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
        const language = (item.municipalityLanguages || []).find((municipalityLanguage) => municipalityLanguage.languageId === currentLocale);
        return {
          id: item.id,
          name: language ? language.name : config.noNameDefault,
          provinceId: item.provinceId,
        };
      }),
      total: count,
    });
  });

  app.get(
    `${routePrefix}/:id`,
    { schema: adminMunicipalitySchema, preParsing: app.permGuard("admin.municipalities.show") },
    async (request, reply) => {
      const { id } = request.params;

      const instance = await Municipality.findByPk(id, {
        include: [
          {
            model: MunicipalityLanguage,
            as: "municipalityLanguages",
          },
        ],
      });

      if (!instance) {
        return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
      }

      const response = {
        id: instance.id,
        slug: instance.slug,
        provinceId: instance.provinceId,
        latitude: instance.latitude,
        longitude: instance.longitude,
        image: instance.image ? imageUrlBase(instance.slug, instance.image) : null,
        mobileImage: instance.mobileImage ? imageUrlBase(instance.slug, instance.mobileImage) : null,
        showFrontend: instance.showFrontend,
        municipalityLanguages: {} as Record<
          string,
          {
            langId: string;
            name: string;
            description: string;
          }
        >,
      };

      for (const lang of instance.municipalityLanguages || []) {
        response.municipalityLanguages[lang.languageId] = {
          langId: lang.languageId,
          name: lang.name,
          description: lang.description,
        };
      }

      return reply.code(HTTP_STATUS_OK).send(response);
    }
  );

  app.post(
    routePrefix,
    { schema: adminMunicipalityCreateSchema, preParsing: app.permGuard("admin.municipalities.create") },
    async (request, reply) => {
      try {
        const { id, provinceId, latitude, longitude, radius, radiusUnit, image, mobileImage, showFrontend, municipalityLanguages } = request.body;

        const instance = await sequelizeConnector.transaction(async (t) => {
          // Create main record
          const record = await Municipality.create(
            {
              id,
              slug: randomString(),
              provinceId: provinceId,
              latitude,
              longitude,
              radius,
              radiusUnit,
              image: randomString(),
              mobileImage: randomString(),
              showFrontend: app.permGuardCheck("admin.municipalities.field.show_frontend") ? showFrontend ?? false : false,
            },
            { transaction: t }
          );

          // Set slug and image from default language
          const defaultIsoCode = await app.defaultIsoCode(t);
          const defaultLang = municipalityLanguages[defaultIsoCode];
          record.slug = slugifyService(`${defaultLang.name} ${record.id}`);
          if (image) {
            record.image = await saveUploadedFile(image, ["images", "municipalities"], `${record.slug}-${Date.now()}`);
          } else {
            record.image = null;
          }
          if (mobileImage) {
            record.mobileImage = await saveUploadedFile(mobileImage, ["images", "municipalities"], `${record.slug}-mobile-${Date.now()}`);
          } else {
            record.mobileImage = null;
          }
          await record.save({ transaction: t });

          // Create language entries
          for (const isoCode in municipalityLanguages) {
            const lang = municipalityLanguages[isoCode];
            await MunicipalityLanguage.create(
              {
                municipalityId: record.id,
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
          provinceId: instance.provinceId,
          latitude: instance.latitude,
          longitude: instance.longitude,
          image: instance.image ? imageUrlBase(instance.slug, instance.image) : null,
          mobileImage: instance.mobileImage ? imageUrlBase(instance.slug, instance.mobileImage) : null,
          showFrontend: instance.showFrontend,
          municipalityLanguages,
        });
      } catch (error) {
        return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
      }
    }
  );

  app.put(
    `${routePrefix}/:id`,
    { schema: adminMunicipalityEditSchema, preParsing: app.permGuard("admin.municipalities.edit") },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const { slug, provinceId, latitude, longitude, radius, radiusUnit, image, mobileImage, showFrontend, municipalityLanguages } = request.body;

        const instance = await sequelizeConnector.transaction(async (t) => {
          const record = await getInstance(id, t);
          if (!record) return null;

          // Update main record
          record.slug = slug;
          record.provinceId = provinceId;
          record.latitude = latitude;
          record.longitude = longitude;
          record.radius = radius;
          record.radiusUnit = radiusUnit;
          record.showFrontend = app.permGuardCheck("admin.municipalities.field.show_frontend") ? showFrontend ?? false : record.showFrontend;

          if (image) {
            if (record.image) deleteUploadedFile(record.image, ["images", "municipalities"]);
            record.image = await saveUploadedFile(image, ["images", "municipalities"], `${slug}-${Date.now()}`);
          } else if (image === null && record.image) {
            //TO DO: See if we can send from frontend null if user deleted image
            //deleteUploadedFile(record.image, ["images", "municipalities"]);
            record.image = null;
          }
          if (mobileImage) {
            if (record.mobileImage) deleteUploadedFile(record.mobileImage, ["images", "municipalities"]);
            record.mobileImage = await saveUploadedFile(mobileImage, ["images", "municipalities"], `${slug}-mobile-${Date.now()}`);
          } else if (mobileImage === null && record.mobileImage) {
            record.mobileImage = null;
          }

          await record.save({ transaction: t });

          // Replace language entries
          await MunicipalityLanguage.destroy({ where: { municipalityId: record.id }, transaction: t });

          for (const isoCode in municipalityLanguages) {
            const lang = municipalityLanguages[isoCode];
            await MunicipalityLanguage.create(
              {
                municipalityId: record.id,
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
          provinceId: instance.provinceId,
          latitude: instance.latitude,
          longitude: instance.longitude,
          image: instance.image ? imageUrlBase(instance.slug, instance.image) : null,
          mobileImage: instance.mobileImage ? imageUrlBase(instance.slug, instance.mobileImage) : null,
          showFrontend: instance.showFrontend,
          municipalityLanguages,
        });
      } catch (error) {
        return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
      }
    }
  );

  app.delete(
    `${routePrefix}/:id`,
    { schema: adminMunicipalityDeleteSchema, preParsing: app.permGuard("admin.municipalities.delete") },
    async (request, reply) => {
      try {
        const { id } = request.params;

        const instance = await sequelizeConnector.transaction(async (t) => {
          const record = await getInstance(id, t);
          if (!record) {
            return null;
          }

          if (record.image) {
            deleteUploadedFile(record.image, ["images", "municipalities"]);
          }
          if (record.mobileImage) {
            deleteUploadedFile(record.mobileImage, ["images", "municipalities"]);
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

export default adminMunicipalityController;
