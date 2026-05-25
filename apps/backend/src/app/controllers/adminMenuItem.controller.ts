import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { Op, Transaction } from "sequelize";
import {
  adminMenuItemCreateSchema,
  adminMenuItemDeleteSchema,
  adminMenuItemEditSchema,
  adminMenuItemListSchema,
  adminMenuItemSchema,
} from "../schemas/adminMenuItem.schema";
import { HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../../config/httpStatus.config";
import { MenuItem, MenuItemLanguage, Language, Category } from "../models";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import sequelizeConnector from "../../config/sequelizeConnector.config";
import { menuItemIconUrlBase } from "../../utils/formatI18nMenu.util";
import { deleteUploadedFile, saveUploadedFile } from "../../utils/upload";
import { MenuItemType } from "../../entries/menuTypes.entry";
import { adminMenuItemLanguage } from "../schemas/adminMenuItem.schema";

const adminMenuItemController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  const formatLanguages = (instance: MenuItem) =>
    (instance.menuItemLanguages || []).reduce(
      (previous, current) => ({
        ...previous,
        [current.languageId]: {
          langId: current.language!.id,
          title: current.title,
        },
      }),
      {} as Record<string, z.infer<typeof adminMenuItemLanguage>>
    );

  const getInstance = async (id: number, t?: Transaction) =>
    await MenuItem.findOne({
      where: { id },
      include: [
        { model: MenuItem, as: "childMenuItems" },
        { model: MenuItemLanguage, as: "menuItemLanguages", include: [{ model: Language, as: "language" }] },
        { model: Category, as: "category" },
      ],
      transaction: t,
    });

  app.get(routePrefix, { schema: adminMenuItemListSchema, preParsing: app.permGuard("admin.menu-items.list") }, async (request, reply) => {
    const { rangeFirst, rangeLast, sortBy, sortOrder, filter } = request.query;
    const filters: { title?: string; q?: string; type?: string; parentId?: number } = JSON.parse(filter);
    const currentLocale = await app.currentLocale(request);

    const { count, rows } = await MenuItem.findAndCountAll({
      where: {
        ...(filters.type ? { type: filters.type } : {}),
        ...(filters.parentId ? { parentId: filters.parentId } : {}),
      },
      offset: rangeFirst,
      limit: rangeLast - rangeFirst + 1,
      order: [[sortBy, sortOrder]],
      include: [
        {
          association: "menuItemLanguages",
          include: [{ association: "language" }],
          where: filters.q ? { title: { [Op.like]: `%${filters.q}%` } } : undefined,
          required: filters.q ? true : false,
          separate: filters.q ? undefined : true,
        },
      ],
      distinct: true,
    });

    return reply.code(HTTP_STATUS_OK).send({
      data: rows.map((item) => {
        const language = item.menuItemLanguages?.find((lang) => lang.languageId === currentLocale);
        return {
          id: item.id,
          title: language?.title || "",
          type: item.type,
          categoryId: item.categoryId,
          isVisible: item.isVisible,
          parentId: item.parentId,
        };
      }),
      total: count,
    });
  });

  app.get(`${routePrefix}/:id`, { schema: adminMenuItemSchema, preParsing: app.permGuard("admin.menu-items.show") }, async (request, reply) => {
    const { id } = request.params;
    const instance = await getInstance(id);

    if (!instance) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }
    return reply.code(HTTP_STATUS_OK).send({
      id: instance.id,
      parentId: instance.parentId,
      categoryId: instance.categoryId,
      url: instance.url,
      icon: menuItemIconUrlBase(instance.icon),
      type: instance.type,
      isVisible: instance.isVisible,
      position: instance.position,
      maxItems: instance.maxItems,
      menuItemLanguages: formatLanguages(instance),
    });
  });

  // Create menu item
  app.post(routePrefix, { schema: adminMenuItemCreateSchema, preParsing: app.permGuard("admin.menu-items.add") }, async (request, reply) => {
    const { url, icon, type, isVisible, position, parentId, menuItemLanguages, categoryId, maxItems } = request.body;
    const { instance, instanceChildObj } = await sequelizeConnector.transaction(async (t) => {
      const record = await MenuItem.create(
        {
          url: url || null,
          type,
          isVisible,
          position,
          parentId: parentId || null,
          categoryId: type === MenuItemType.CATEGORY_ARTICLES || type === MenuItemType.CATEGORY_EVENTS ? (categoryId ?? null) : null,
          maxItems: maxItems ?? 3,
        },
        { transaction: t }
      );

      if (icon) {
        record.icon = await saveUploadedFile(icon, ["images", "menu-icons"], `${record.id}-${Date.now()}`);
        await record.save({ transaction: t });
      }
      let recordChildObj: { [key: string]: z.infer<typeof adminMenuItemLanguage> } = {};
      for (const [isoCode, { langId, title }] of Object.entries(menuItemLanguages)) {
        const recordChild = await MenuItemLanguage.create(
          {
            menuItemId: record.id,
            languageId: langId,
            title: title,
          },
          { transaction: t }
        );
        recordChildObj[recordChild.languageId] = {
          langId: recordChild.languageId,
          title: recordChild.title,
        };
      }
      return { instance: record, instanceChildObj: recordChildObj };
    });

    if (!instance) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }
    return reply.code(HTTP_STATUS_CREATED).send({
      id: instance.id,
      parentId: instance.parentId,
      categoryId: instance.categoryId,
      url: instance.url,
      icon: menuItemIconUrlBase(instance.icon),
      type: instance.type,
      isVisible: instance.isVisible,
      position: instance.position,
      maxItems: instance.maxItems,
      menuItemLanguages: instanceChildObj,
    });
  });

  // Edit menu item
  app.put(`${routePrefix}/:id`, { schema: adminMenuItemEditSchema, preParsing: app.permGuard("admin.menu-items.edit") }, async (request, reply) => {
    const { id } = request.params;
    const { url, icon, type, isVisible, position, parentId, menuItemLanguages, categoryId, maxItems } = request.body;
    const instance = await sequelizeConnector.transaction(async (t) => {
      const record = await MenuItem.findByPk(id, { transaction: t });
      if (!record) return null;

      record.url = url || null;
      record.type = type;
      record.isVisible = isVisible;
      record.position = position;
      record.parentId = parentId || null;
      record.categoryId = type === MenuItemType.CATEGORY_ARTICLES || type === MenuItemType.CATEGORY_EVENTS ? (categoryId ?? null) : null;
      record.maxItems = maxItems ?? 3;

      await MenuItemLanguage.destroy({ where: { menuItemId: record.id }, transaction: t });

      const menuItemLanguagesFormatted: { [key: string]: z.infer<typeof adminMenuItemLanguage> } = {};

      for (const [isoCode, { langId, title }] of Object.entries(menuItemLanguages)) {
        const recordChild = await MenuItemLanguage.create(
          {
            menuItemId: record.id,
            languageId: langId,
            title,
          },
          { transaction: t }
        );

        menuItemLanguagesFormatted[recordChild.languageId] = {
          langId: recordChild.languageId,
          title: recordChild.title,
        };
      }

      if (icon) {
        if (record.icon) deleteUploadedFile(record.icon, ["images", "menu-icons"]);
        record.icon = await saveUploadedFile(icon, ["images", "menu-icons"], `${record.id}-${Date.now()}`);
      }

      await record.save({ transaction: t });

      return { record, recordChildObj: menuItemLanguagesFormatted };
    });

    if (!instance) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }
    return reply.code(HTTP_STATUS_CREATED).send({
      id: instance.record.id,
      parentId: instance.record.parentId,
      categoryId: instance.record.categoryId,
      url: instance.record.url,
      icon: menuItemIconUrlBase(instance.record.icon),
      type: instance.record.type,
      isVisible: instance.record.isVisible,
      position: instance.record.position,
      maxItems: instance.record.maxItems,
      menuItemLanguages: instance.recordChildObj,
    });
  });

  // Delete menu item
  app.delete(`${routePrefix}/:id`, { schema: adminMenuItemDeleteSchema, preParsing: app.permGuard("admin.menu-items.delete") }, async (request, reply) => {
    const { id } = request.params;
    const instance = await sequelizeConnector.transaction(async (t) => {
      const menuItem = await MenuItem.findByPk(id, { transaction: t });
      if (!menuItem) return null;

      // when we delete a menu item lets not execute the poor kids as well since they've done nothing wrong
      await MenuItem.update(
        { parentId: null },
        {
          where: { parentId: id },
          transaction: t,
        }
      );

      if (menuItem.icon) {
        deleteUploadedFile(menuItem.icon, ["images", "menu-icons"]);
      }

      await MenuItemLanguage.destroy({ where: { menuItemId: id }, transaction: t });
      await menuItem.destroy({ transaction: t });
      return menuItem;
    });

    if (!instance) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send(request.i18n.t("http_messages.not_found"));
    }
    return reply.code(HTTP_STATUS_NO_CONTENT).send(true);
  });
};

export default adminMenuItemController;
