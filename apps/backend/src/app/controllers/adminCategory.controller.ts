import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { Op, Transaction } from "sequelize";
import {
  adminCategoryCreateSchema,
  adminCategoryDeleteSchema,
  adminCategoryEditSchema,
  adminCategoryLanguages,
  adminCategoryListSchema,
  adminCategorySchema,
} from "../schemas/adminCategory.schema";
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_SERVER_ERROR,
} from "../../config/httpStatus.config";
import { Category, CategoryLanguage, Language, CategoryTag } from "../models";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import { deleteUploadedFile, saveUploadedFile } from "../../utils/upload";
import config from "../../config/app.config";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import randomString from "../../utils/randomString";
import slugifyService from "../services/slugify.service";
import CategoriesType, { CategoryPageView } from "../../entries/categoriesType.entry";

const adminCategoryController: FastifyPluginAsyncZod<IBaseRoute & { type: CategoriesType }> = async (app, options) => {
  const { routePrefix, type } = options;

  const getInstance = async (id: number, transaction?: Transaction) => {
    return await Category.findOne({
      where: { id },
      include: [
        {
          model: CategoryLanguage,
          as: "categoryLanguages",
          include: [
            {
              model: Language,
              as: "language",
            },
          ],
        },
        { association: "tags" },
      ],
      transaction,
    });
  };

  const formatLanguages = (instance: Category) =>
    (instance.categoryLanguages || []).reduce(
      (previous, current) => ({
        ...previous,
        [current.languageId]: {
          langId: current.language!.id,
          name: current.name,
          description: current.description,
        },
      }),
      {} as Record<string, z.infer<typeof adminCategoryLanguages>>
    );

  const imageUrlBase = (imageName: string, imageFileName: string) => ({
    src: `${config.serverNameStatics}/uploads/images/categories/${imageFileName}`,
    title: imageName,
  });

  app.get(routePrefix, { schema: adminCategoryListSchema, preParsing: app.permGuard(`admin.${type}.list`) }, async (request, reply) => {
    const { rangeFirst, rangeLast, sortBy, sortOrder, filter } = request.query;
    const filters: { name?: string; q?: string; parent?: number | null } = JSON.parse(filter);

    const { count, rows } = await Category.findAndCountAll({
      where: {
        ...(filters.parent !== undefined ? (filters.parent === null ? { parentId: { [Op.is]: null } } : { parentId: filters.parent }) : {}),
        ...(type === CategoriesType.ALL ? {} : { type }),
      },
      include: [
        {
          association: "categoryLanguages",
          where: {
            ...(filters.name ? { name: { [Op.like]: `%${filters.name}%` } } : {}),
            ...(filters.q ? { name: { [Op.like]: `%${filters.q}%` } } : {}),
          },
          required: filters.name || filters.q ? true : false,
          separate: filters.name || filters.q ? undefined : true,
        },
      ],
      offset: rangeFirst,
      limit: rangeLast - rangeFirst + 1,
      order: [[sortBy, sortOrder]],
      distinct: true,
    });

    const currentLocale = await app.currentLocale(request);

    return reply.code(HTTP_STATUS_OK).send({
      data: rows.map((item) => {
        const language = (item.categoryLanguages || []).find((categoryLanguage) => categoryLanguage.languageId === currentLocale);
        return {
          id: item.id,
          name: language ? language.name : config.noNameDefault,
          parentId: item.parentId,
          slug: item.slug,
        };
      }),
      total: count,
    });
  });

  app.get(`${routePrefix}/:id`, { schema: adminCategorySchema, preParsing: app.permGuard(`admin.${type}.show`) }, async (request, reply) => {
    const { id } = request.params;

    const instance = await getInstance(id);

    if (!instance) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }

    return reply.code(HTTP_STATUS_OK).send({
      id: instance.id,
      slug: instance.slug,
      parent: instance.parentId,
      pageView: instance.pageView,
      tags: (instance.tags || []).map((tag) => tag.id),
      image: instance.image ? imageUrlBase(instance.slug, instance.image) : null,
      mobileImage: instance.mobileImage ? imageUrlBase(instance.slug, instance.mobileImage) : null,
      categoryLanguages: formatLanguages(instance),
    });
  });

  app.post(routePrefix, { schema: adminCategoryCreateSchema, preParsing: app.permGuard(`admin.${type}.add`) }, async (request, reply) => {
    try {
      const { parent, image, mobileImage, categoryLanguages, pageView, tags } = request.body;

      const { instance, instanceChildObj, instanceTags } = await sequelizeConnector.transaction(async (t) => {
        const record = await Category.create(
          { slug: randomString(), userId: request.user.id, parentId: parent, image: randomString(), type, pageView: pageView || CategoryPageView.POSTS_VIEW },
          { transaction: t }
        );
        const defaultIsoCode = await app.defaultIsoCode(t);
        let recordChildObj: { [key: string]: z.infer<typeof adminCategoryLanguages> } = {};
        for (const [isoCode, { langId, name, description }] of Object.entries(categoryLanguages)) {
          if (isoCode === defaultIsoCode) {
            record.slug = slugifyService(`${name} ${record.id}`);
            if (image) {
              record.image = await saveUploadedFile(image, ["images", "categories"], `${record.slug}-${Date.now()}`);
            } else {
              record.image = null;
            }
            if (mobileImage) {
              record.mobileImage = await saveUploadedFile(mobileImage, ["images", "categories"], `${record.slug}-mobile-${Date.now()}`);
            } else {
              record.mobileImage = null;
            }
            await record.save({ transaction: t });
          }
          const recordChild = await CategoryLanguage.create(
            {
              categoryId: record.id,
              languageId: langId,
              name: name,
              description: description || undefined,
            },
            { transaction: t }
          );
          recordChildObj[recordChild.languageId] = {
            langId: recordChild.languageId,
            name: recordChild.name,
            description: recordChild.description,
          };
        }

        // Handle tags association
        const tagsCreated = tags && Array.isArray(tags) 
          ? await CategoryTag.bulkCreate(
              tags.map((item) => ({ categoryId: record.id, tagId: item })),
              { transaction: t }
            )
          : [];

        return { instance: record, instanceChildObj: recordChildObj, instanceTags: tagsCreated };
      });

      return reply.code(HTTP_STATUS_CREATED).send({
        id: instance.id,
        parent: instance.parentId,
        pageView: instance.pageView,
        tags: instanceTags.map((item) => item.tagId),
        image: instance.image ? imageUrlBase(instance.slug, instance.image) : null,
        mobileImage: instance.mobileImage ? imageUrlBase(instance.slug, instance.mobileImage) : null,
        slug: instance.slug,
        categoryLanguages: instanceChildObj,
      });
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  //EDIT Category
  app.put(`${routePrefix}/:id`, { schema: adminCategoryEditSchema, preParsing: app.permGuard(`admin.${type}.edit`) }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { slug, parent, image, mobileImage, categoryLanguages, pageView, tags } = request.body;

      const instance = await sequelizeConnector.transaction(async (t) => {
        const record = await getInstance(id, t);
        if (!record) {
          return null;
        }

        record.parentId = parent!;
        record.slug = slug;
        record.pageView = pageView ?? CategoryPageView.POSTS_VIEW;

        if (image) {
          if (record.image) deleteUploadedFile(record.image, ["images", "categories"]);
          record.image = await saveUploadedFile(image, ["images", "categories"], `${record.slug}-${Date.now()}`);
        } else if (image === null && record.image) {
          //TO DO: See if we can send from frontend null if user deleted image
          //deleteUploadedFile(record.image, ["images", "categories"]);
          record.image = null;
        }
        if (mobileImage) {
          if (record.mobileImage) deleteUploadedFile(record.mobileImage, ["images", "categories"]);
          record.mobileImage = await saveUploadedFile(mobileImage, ["images", "categories"], `${record.slug}-mobile-${Date.now()}`);
        } else if (mobileImage === null && record.mobileImage) {
          //TO DO: See if we can send from frontend null if user deleted image
          //deleteUploadedFile(record.mobileImage, ["images", "categories"]);
          record.mobileImage = null;
        }

        await record.save({ transaction: t });

        await CategoryLanguage.destroy({ where: { categoryId: record.id }, transaction: t });

        const categoryLanguagesFormatted: { [key: string]: z.infer<typeof adminCategoryLanguages> } = {};

        for (const [isoCode, { langId, name, description }] of Object.entries(categoryLanguages)) {
          const recordChild = await CategoryLanguage.create(
            {
              categoryId: record.id,
              languageId: langId,
              name,
              description: description || undefined,
            },
            { transaction: t }
          );

          categoryLanguagesFormatted[recordChild.languageId] = {
            langId: recordChild.languageId,
            name: recordChild.name,
            description: recordChild.description,
          };
        }

        // Handle tags association
        await CategoryTag.destroy({ where: { categoryId: record.id }, transaction: t });
        const tagsCreated = tags && Array.isArray(tags)
          ? await CategoryTag.bulkCreate(
              tags.map((item) => ({ categoryId: record.id, tagId: item })),
              { transaction: t }
            )
          : [];

        return { record, categoryLanguagesFormatted, tagsCreated };
      });

      if (!instance) return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));

      return reply.code(HTTP_STATUS_CREATED).send({
        id: instance.record.id,
        parent: instance.record.parentId,
        pageView: instance.record.pageView,
        tags: instance.tagsCreated.map((item) => item.tagId),
        image: instance.record.image ? imageUrlBase(instance.record.slug, instance.record.image) : null,
        mobileImage: instance.record.mobileImage ? imageUrlBase(instance.record.slug, instance.record.mobileImage) : null,
        categoryLanguages: instance.categoryLanguagesFormatted,
        slug: instance.record.slug,
      });
    } catch (error) {
      return reply.code(HTTP_STATUS_SERVER_ERROR).send(request.i18n.t("http_messages.server_error"));
    }
  });

  // Delete Category
  app.delete(
    `${routePrefix}/:id`,
    { schema: adminCategoryDeleteSchema, preParsing: app.permGuard(`admin.${type}.delete`) },
    async (request, reply) => {
      const { id } = request.params;
      const instance = await getInstance(id);

      if (!instance) return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));

      await instance.destroy();
      if (instance.image) deleteUploadedFile(instance.image, ["images", "categories"]);

      return reply.code(HTTP_STATUS_NO_CONTENT).send(true);
    }
  );
};

export default adminCategoryController;
