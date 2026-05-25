import fastify from "fastify";
import { ZodError } from "zod";
import i18n from "fastify-i18n";
import fastifyHelmet from "@fastify/helmet";
import fastifyCors from "@fastify/cors";
import fastifyAuth from "@fastify/auth";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import { hasZodFastifySchemaValidationErrors, isResponseSerializationError, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import fjwt, { JWT } from "@fastify/jwt";
import fCookie from "@fastify/cookie";
import { HTTP_STATUS_SERVER_ERROR, HTTP_STATUS_UNPROCESSABLE_CONTENT } from "./config/httpStatus.config";
import validationArrayToObject from "./utils/validationArrayToObject";

import adminUserController from "./app/controllers/adminUser.controller";
import adminGroupController from "./app/controllers/adminGroup.controller";
import adminPermissionController from "./app/controllers/adminPermission.controller";
import adminRegionController from "./app/controllers/adminRegion.controller";
import adminProvinceController from "./app/controllers/adminProvince.controller";
import adminMunicipalityController from "./app/controllers/adminMunicipality.controller";
import adminLanguageController from "./app/controllers/adminLanguage.controller";

import adminAuthController from "./app/controllers/adminAuth.controller";
import jwtAuthenticatePlugin from "./plugins/jwtAuthenticate.plugin";
import i18nLocale from "./plugins/i18nLocale.plugin";

import itI18n from "./i18n/it.i18n";
import enI18n from "./i18n/en.i18n";
import config from "./config/app.config";
import permissionsRoutesGuardPlugin from "./plugins/permissionsRoutesGuard.plugin";
import { registerDb } from "./config/db.config";

import CategoriesType from "./entries/categoriesType.entry";
import ArticlesType from "./entries/articlesType.entry";

import path from "path";
import adminCategoryController from "./app/controllers/adminCategory.controller";
import adminArticleController from "./app/controllers/adminArticle.controller";
import adminEventController from "./app/controllers/adminEvent.controller";
import websiteBaseController from "./app/controllers/websiteBase.controller";
import adminPodcastController from "./app/controllers/adminPodcast.controller";
import adminI18nController from "./app/controllers/adminI18n.controller";
import websiteProvincePageController from "./app/controllers/websiteProvincePage.controller";
import websiteRegionPageController from "./app/controllers/websiteRegionPage.controller";
import websiteMunicipalityPageController from "./app/controllers/websiteMunicipalityPage.controller";
import websitePodcastPageController from "./app/controllers/websitePodcastPage.controller";
import websiteArticlePageController from "./app/controllers/websiteArticlePage.controller";
import adminMediaController from "./app/controllers/adminMedia.controller";
import websiteHomepageController from "./app/controllers/websiteHomepage.controller";
import websiteMenuController from "./app/controllers/websiteMenu.controller";
import adminMenuItemController from "./app/controllers/adminMenuItem.controller";
import adminSettingsController from "./app/controllers/adminSettings.controller";
import websiteEventPageController from "./app/controllers/websiteEventPage.controller";
import websiteCategoryPageController from "./app/controllers/websiteCategoryPage.controller";
import adminContactFormController from "./app/controllers/adminContactForm.controller";
import websiteContactFormController from "./app/controllers/websiteContactForm.controller";
import adminBusinessRegistrationFormController from "./app/controllers/adminBusinessRegistrationForm.controller";
import websiteBusinessRegistrationFormController from "./app/controllers/websiteBusinessRegistrationForm.controller";
import adminNewsletterController from "./app/controllers/adminNewsletter.controller";
import websiteAroundYouPageController from "./app/controllers/websiteAroundYouPage.controller";
import adminPageController from "./app/controllers/adminPage.controller";
import websitePageController from "./app/controllers/websitePage.controller";
import subscriptionController from "./app/controllers/subscription.controller";
import adminTagController from "./app/controllers/adminTag.controller";
import websiteSearchController from "./app/controllers/websiteSearch.controller";
import websiteMemberAuthController from "./app/controllers/websiteMemberAuth.controller";

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
}

const server = fastify({
  bodyLimit: 10 * 1024 * 1024, // 10MB
});

/** Fastify plugins */
server.register(fastifyHelmet, { global: true, crossOriginResourcePolicy: false });
server.register(fastifyRateLimit, {
  max: config.rateLimitMax,
  timeWindow: "1 minute",
});
server.register(fastifyCors, {
  origin: ["https://in-italy.cloudsoftware.it", "https://www.initaly.it", "http://localhost:5173", "http://localhost:3000"],
  credentials: true,
});

server.register(fastifyStatic, { root: path.join(__dirname, "../public") });

server.register(i18n, {
  fallbackLocale: config.fallbackLocale,
  messages: {
    it: itI18n,
    en: enI18n,
  },
});

server.register(i18nLocale, { fallbackLocale: config.fallbackLocale });

// typeorm
registerDb(server);

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(fastifyAuth);
// jwt
server.register(fjwt, { secret: "D4h62$gkR8g8!H64$73he83Db!" });
server.addHook("onRequest", (req, res, done) => {
  // here we are
  req.jwt = server.jwt;
  return done();
});

// cookies
server.register(fCookie, {
  secret: "8!H64$73he83Db!D4h62$gkR8g",
  hook: "onRequest",
});

server.setErrorHandler((err, req, reply) => {
  if (hasZodFastifySchemaValidationErrors(err)) {
    return reply.code(HTTP_STATUS_UNPROCESSABLE_CONTENT).send({
      message: "Request Validation Error",
      errors: validationArrayToObject(
        err.validation.map((item) => item.params.issue.path),
        err.validation.map((item) => item.params.issue.message)
      ),
    });
  }
  if (isResponseSerializationError(err)) {
    return reply.code(HTTP_STATUS_SERVER_ERROR).send({
      error: "Internal Server Error",
      message: "Response doesn't match the schema",
      statusCode: 500,
      details: {
        issues: err.cause.issues,
        method: err.method,
        url: err.url,
      },
    });
  }
  if (err instanceof ZodError && err.issues) {
    if (err.issues.length > 0) {
      return reply.code(HTTP_STATUS_UNPROCESSABLE_CONTENT).send({
        message: "Request Validation Error",
        errors: validationArrayToObject(
          err.issues.map((item) => item.path),
          err.issues.map((item) => item.message)
        ),
      });
    }
  }
  return reply.code(HTTP_STATUS_SERVER_ERROR).send(err);
});

/** Admin App controllers */
server.register((adminApp) => {
  adminApp.register(jwtAuthenticatePlugin);
  adminApp.register(permissionsRoutesGuardPlugin);
  adminApp.register(adminAuthController, { routePrefix: "/api/radmin/auth" });
  adminApp.register((adminAppResource) => {
    adminAppResource.addHook("onRequest", adminApp.auth([adminApp.jwtAuthenticate]));
    adminAppResource.register(adminUserController, { routePrefix: "/api/radmin/users" });
    adminAppResource.register(adminGroupController, { routePrefix: "/api/radmin/groups" });
    adminAppResource.register(adminPermissionController, { routePrefix: "/api/radmin/permissions" });
    adminAppResource.register(adminRegionController, { routePrefix: "/api/radmin/regions" });
    adminAppResource.register(adminProvinceController, { routePrefix: "/api/radmin/provinces" });
    adminAppResource.register(adminMunicipalityController, { routePrefix: "/api/radmin/municipalities" });
    adminAppResource.register(adminLanguageController, { routePrefix: "/api/radmin/languages" });
    adminAppResource.register(adminArticleController, { routePrefix: "/api/radmin/articles", type: ArticlesType.ARTICLES });
    adminAppResource.register(adminArticleController, { routePrefix: "/api/radmin/news", type: ArticlesType.NEWS });
    adminAppResource.register(adminCategoryController, { routePrefix: "/api/radmin/categories", type: CategoriesType.ALL });
    adminAppResource.register(adminCategoryController, { routePrefix: "/api/radmin/categories-articles", type: CategoriesType.ARTICLES });
    adminAppResource.register(adminCategoryController, { routePrefix: "/api/radmin/categories-events", type: CategoriesType.EVENTS });
    adminAppResource.register(adminCategoryController, { routePrefix: "/api/radmin/categories-podcasts", type: CategoriesType.PODCASTS });
    adminAppResource.register(adminEventController, { routePrefix: "/api/radmin/events" });
    adminAppResource.register(adminPodcastController, { routePrefix: "/api/radmin/podcasts" });
    adminAppResource.register(adminMediaController, { routePrefix: "/api/radmin/media" });
    adminAppResource.register(adminI18nController, { routePrefix: "/api/radmin/website-intl" });
    adminAppResource.register(adminSettingsController, { routePrefix: "/api/radmin/settings" });
    adminAppResource.register(adminMenuItemController, { routePrefix: "/api/radmin/menu-items" });
    adminAppResource.register(adminNewsletterController, { routePrefix: "/api/radmin/newsletter" });
    adminAppResource.register(adminContactFormController, { routePrefix: "/api/radmin/contact-form" });
    adminAppResource.register(adminBusinessRegistrationFormController, { routePrefix: "/api/radmin/business-registration-form" });
    adminAppResource.register(adminPageController, { routePrefix: "/api/radmin/pages" });
    adminAppResource.register(adminTagController, { routePrefix: "/api/radmin/tags" });
  });
});

/** Public App controllers */
server.register((websiteApp) => {
  websiteApp.register((websiteAppResource) => {
    const routePrefix = "/api/website";
    websiteAppResource.register(websiteBaseController, { routePrefix: routePrefix });
    websiteAppResource.register(websiteHomepageController, { routePrefix: routePrefix });
    websiteAppResource.register(websiteProvincePageController, { routePrefix: routePrefix });
    websiteAppResource.register(websiteRegionPageController, { routePrefix: routePrefix });
    websiteAppResource.register(websiteMunicipalityPageController, { routePrefix: routePrefix });
    websiteAppResource.register(websitePodcastPageController, { routePrefix: routePrefix });
    websiteAppResource.register(websiteArticlePageController, { routePrefix: routePrefix });
    websiteAppResource.register(websiteEventPageController, { routePrefix: routePrefix });
    websiteAppResource.register(websiteMenuController, { routePrefix: routePrefix });
    websiteAppResource.register(websiteCategoryPageController, { routePrefix: routePrefix });
    websiteAppResource.register(websiteContactFormController, { routePrefix: routePrefix });
    websiteAppResource.register(websiteBusinessRegistrationFormController, { routePrefix: routePrefix });
    websiteAppResource.register(websiteAroundYouPageController, { routePrefix: routePrefix });
    websiteAppResource.register(websitePageController, { routePrefix: routePrefix });
    websiteAppResource.register(subscriptionController, { routePrefix: routePrefix });
    websiteAppResource.register(websiteSearchController, { routePrefix: routePrefix });
    websiteAppResource.register(websiteMemberAuthController, { routePrefix: routePrefix });
  });
});

/** Server start */
server.listen({ port: 8000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
