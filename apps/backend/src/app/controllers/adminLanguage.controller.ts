import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { Like, Not } from "typeorm";
import {
  adminLanguageCreateSchema,
  adminLanguageDeleteSchema,
  adminLanguageEditSchema,
  adminLanguageListSchema,
  adminLanguageSchema,
  adminLanguageSortSchema,
} from "../schemas/adminLanguage.schema";
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_SERVER_ERROR,
} from "../../config/httpStatus.config";
import { Language } from "../entities/language.model";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import { deleteUploadedFile, saveUploadedFile } from "../../utils/upload";
import config from "../../config/app.config";

const adminLanguageController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;
  const getInstance = async (id: string) => await app.orm.getRepository(Language).findOne({ where: { id } });

  const imageUrlBase = (imageName: string, imageFileName: string) => ({
    src: `${config.serverNameStatics}/uploads/images/languages/${imageFileName}`,
    title: imageName,
  });

  app.get(routePrefix, { schema: adminLanguageListSchema, preParsing: app.permGuard("admin.languages.list") }, async (request, reply) => {
    const { rangeFirst, rangeLast, sortBy, sortOrder, filter } = request.query;
    const filters: { name?: string; isoCode?: string } = JSON.parse(filter);
    const repository = app.orm.getRepository(Language);
  
    const [rows, count] = await repository.findAndCount({
      where: {
        ...(filters.name ? { name: Like(`${filters.name}%`) } : {}),
        ...(filters.isoCode ? { isoCode: Like(`${filters.isoCode}%`) } : {}),
      },
      skip: rangeFirst,
      take: rangeLast - rangeFirst + 1,
      order: { [sortBy]: sortOrder },
    });

    return reply.code(HTTP_STATUS_OK).send({
      data: rows.map((item) => ({
        id: item.id,
        name: item.name,
        default: item.default,
        status: item.status,
        image: imageUrlBase(item.name, item.image),
        sortOrder: item.sortOrder,
      })),
      total: count,
    });
  });

  app.get(`${routePrefix}/:id`, { schema: adminLanguageSchema, preParsing: app.permGuard("admin.languages.show") }, async (request, reply) => {
    const { id } = request.params;
    const instance = await getInstance(id);
    if (!instance) return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    return reply.code(HTTP_STATUS_OK).send({
      id: instance.id,
      name: instance.name,
      default: instance.default,
      status: instance.status,
      image: imageUrlBase(instance.name, instance.image),
    });
  });

  app.post(routePrefix, { schema: adminLanguageCreateSchema, preParsing: app.permGuard("admin.languages.create") }, async (request, reply) => {
    const { id, name, default: isDefault, status, image } = request.body;
    const repository = app.orm.getRepository(Language);

    let imageUrl = await saveUploadedFile(image, ["images", "languages"], `${id}-${Date.now()}`);
    const instance = repository.create({ id, name, default: isDefault, status, image: imageUrl || "", sortOrder: 0 });
    await repository.save(instance);

    if (isDefault) {
      await repository.update({ id: Not(instance.id) }, { default: false });
    }

    return reply.code(HTTP_STATUS_CREATED).send({
      id: instance.id,
      name: instance.name,
      default: instance.default,
      status: instance.status,
      image: imageUrlBase(instance.name, instance.image),
    });
  });

  app.put(`${routePrefix}/:id`, { schema: adminLanguageEditSchema, preParsing: app.permGuard("admin.languages.edit") }, async (request, reply) => {
    const { id } = request.params;
    const instance = await getInstance(id);

    if (!instance) return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));

    const { name, default: isDefault, status, image } = request.body;
    const repository = app.orm.getRepository(Language);

    instance.name = name;
    instance.default = isDefault;
    instance.status = status;
    await repository.save(instance);

    if (isDefault) {
      await repository.update({ id: Not(instance.id) }, { default: false });
    }

    if (image) {
      if (instance.image) deleteUploadedFile(instance.image, ["images", "languages"]);
      instance.image = await saveUploadedFile(image, ["images", "languages"], `${id}-${Date.now()}`);
      await repository.save(instance);
    }

    return reply.code(HTTP_STATUS_CREATED).send({
      id: instance.id,
      name: instance.name,
      default: instance.default,
      status: instance.status,
      image: imageUrlBase(instance.name, instance.image),
    });
  });

  app.delete(
    `${routePrefix}/:id`,
    { schema: adminLanguageDeleteSchema, preParsing: app.permGuard("admin.languages.delete") },
    async (request, reply) => {
      const { id } = request.params;
      const instance = await getInstance(id);

      if (!instance) return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
      const repository = app.orm.getRepository(Language);
      await repository.delete(instance.id);
      if (instance.image) deleteUploadedFile(instance.image, ["images", "languages"]);
      return reply.code(HTTP_STATUS_NO_CONTENT).send(true);
    }
  );

  app.post(
    `${routePrefix}/list/sort`,
    { schema: adminLanguageSortSchema, preParsing: app.permGuard("admin.languages.edit") },
    async (request, reply) => {
      const { data } = request.body;
      try {
        await app.orm.transaction(async (manager) => {
          const repository = manager.getRepository(Language);
          for (let index = 0; index < data.length; index++) {
            await repository.update({ id: data[index] }, { sortOrder: index + 1 });
          }
        });

        return reply.code(HTTP_STATUS_OK).send("Sorting updated successfully");
      } catch (error) {
        return reply.code(HTTP_STATUS_SERVER_ERROR).send("Error updating sorting order");
      }
    }
  );
};

export default adminLanguageController;
