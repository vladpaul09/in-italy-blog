import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { MenuItemSchema } from "../schemas/websiteBase.schema";
import { HTTP_STATUS_OK } from "../../config/httpStatus.config";
import { Article, Category, Event, MenuItem, I18n } from "../models";
import { Op } from "sequelize";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import formatI18nMenuItem from "../../utils/formatI18nMenu.util";
import { MenuItemType } from "../../entries/menuTypes.entry";
import config from "../../config/app.config";
import formatI18nArticle from "../../utils/formatI18nArticle.util";
import formatI18nEvent from "../../utils/formatI18nEvent.util";
import CategoriesType from "../../entries/categoriesType.entry";
import stripText from "../../utils/stripText.util";

type MenuItemSchemaWithChildren = z.infer<typeof MenuItemSchema> & {
  children: Array<MenuItemSchemaWithChildren>;
};

const MenuItemSchemaWithChildrenRecursiveSchema: z.ZodType<MenuItemSchemaWithChildren> = MenuItemSchema.extend({
  children: z.lazy(() => MenuItemSchemaWithChildrenRecursiveSchema.array()),
});

const websiteMenuItemsSchema = {
  params: z.object({
    locale: z.string(),
  }),
  response: {
    [HTTP_STATUS_OK]: z.array(MenuItemSchemaWithChildrenRecursiveSchema),
  },
};

const websiteMenuController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  const formatMenuItemsRecursively = async (items: MenuItem[], locale: string): Promise<MenuItemSchemaWithChildren[]> => {
    // Get "See all" translation for the current locale
    const seeAllTranslation = await I18n.findOne({ where: { id: "menuSeeAll", langId: locale } });
    const seeAllText = seeAllTranslation ? stripText(seeAllTranslation.value, false) : "Vedi tutto";

    return Promise.all(
      items.map(async (item) => {
        const formattedItem = await formatI18nMenuItem(item, locale);
        if (item.childMenuItems && (item.childMenuItems || []).length > 0) {
          return {
            ...formattedItem,
            children: await formatMenuItemsRecursively(item.childMenuItems, locale),
          };
        }
        if (item.categoryId) {
          switch (item.type) {
            case MenuItemType.CATEGORY_ARTICLES:
              const categoryArticles = await Category.findOne({
                where: { id: item.categoryId, type: CategoriesType.ARTICLES },
              });

              if (categoryArticles) {
                const articles = await Article.findAll({
                  where: { publish: true },
                  order: [["createdAt", "DESC"]],
                  include: [
                    {
                      association: "articleLanguages",
                    },
                    {
                      association: "categories",
                      where: { id: categoryArticles.id },
                      required: true,
                    },
                    { association: "author" },
                    { association: "authorAlias" },
                  ],
                });

                return {
                  ...formattedItem,
                  type: MenuItemType.TITLE,
                  children: [
                    ...(await Promise.all(
                      articles.slice(0, item.maxItems).map(async (article, index) => {
                        const languageArticle = await formatI18nArticle(article, article.author!, article.authorAlias, locale);
                        return {
                          id: article.id,
                          parentId: item.id,
                          categoryId: item.categoryId,
                          url: `/${locale}/articolo/${article.slug}`,
                          icon: article.image
                            ? {
                                src: `${config.serverNameStatics}/uploads/images/articles/${article.image}`,
                                title: article.image,
                              }
                            : null,
                          image: languageArticle.mobileImage,
                          type: MenuItemType.LINK,
                          isVisible: true,
                          position: index + 1,
                          title: languageArticle.title,
                          children: [],
                        };
                      })
                    )),
                    ...(articles.length > item.maxItems
                      ? [
                          {
                            id: -1,
                            parentId: item.id,
                            categoryId: item.categoryId,
                            url: `/${locale}/categoria/articoli/${categoryArticles.slug}`,
                            icon: {
                              src: `/statics/website/show-all-menu-icon.png`,
                              title: "Show all",
                            },
                            type: MenuItemType.LINK,
                            isVisible: true,
                            position: articles.length + 1,
                            title: seeAllText,
                            children: [],
                          },
                        ]
                      : []),
                  ],
                };
              }

            case MenuItemType.CATEGORY_EVENTS:
              const categoryEvents = await Category.findOne({
                where: { id: item.categoryId, type: CategoriesType.EVENTS },
              });

              if (categoryEvents) {
                const now = new Date();
                const events = await Event.findAll({
                  where: { 
                    publish: true,
                    endDate: { [Op.gte]: now }
                  },
                  order: [["startDate", "DESC"]],
                  include: [
                    {
                      association: "eventLanguages",
                    },
                    {
                      association: "categories",
                      where: { id: categoryEvents.id },
                      required: true,
                    },
                    { association: "author" },
                    { association: "authorAlias" },
                  ],
                });

                return {
                  ...formattedItem,
                  type: MenuItemType.TITLE,
                  children: [
                    ...(await Promise.all(
                      events.slice(0, item.maxItems).map(async (event, index) => {
                        const languageEvent = await formatI18nEvent(event, event.author!, event.authorAlias, locale);
                        return {
                          id: event.id,
                          parentId: item.id,
                          categoryId: item.categoryId,
                          url: `/${locale}/evento/${event.slug}`,
                          icon: event.image
                            ? {
                                src: `${config.serverNameStatics}/uploads/images/events/${event.image}`,
                                title: event.image,
                              }
                            : null,
                          image: languageEvent.mobileImage,
                          type: MenuItemType.LINK,
                          isVisible: true,
                          position: index + 1,
                          title: languageEvent.title,
                          children: [],
                        };
                      })
                    )),
                    ...(events.length > item.maxItems
                      ? [
                          {
                            id: -1,
                            parentId: item.id,
                            categoryId: item.categoryId,
                            url: `/${locale}/categoria/eventi/${categoryEvents.slug}`,
                            icon: {
                              src: `/statics/website/show-all-menu-icon.png`,
                              title: "Show all",
                            },
                            type: MenuItemType.LINK,
                            isVisible: true,
                            position: events.length + 1,
                            title: seeAllText,
                            children: [],
                          },
                        ]
                      : []),
                  ],
                };
              }
            default:
              break;
          }
        }
        return {
          ...formattedItem,
          children: [],
        };
      })
    );
  };

  app.get(`${routePrefix}/:locale/menus`, { schema: websiteMenuItemsSchema }, async (request, reply) => {
    const { locale } = request.params;
    const currentLocale = await app.getRequestLocale(locale);

    const menuItems = await MenuItem.getChildMenuItemsHierarchy(null);

    const menuItemsWithChildren = await formatMenuItemsRecursively(menuItems, currentLocale);

    return reply.code(HTTP_STATUS_OK).send(menuItemsWithChildren);
  });
};

export default websiteMenuController;
