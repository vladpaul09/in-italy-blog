import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND } from "../../config/httpStatus.config";
import IBaseRoute from "../../interfaces/baseRoute.interface";
import { PushSubscription } from "../models";

// Base Subscription Schema matching FCM format
const subscriptionBase = z.object({
  subscription: z.object({
    endpoint: z.string().url(),
    expirationTime: z.string().nullable().optional(),
    keys: z.object({
      p256dh: z.string().min(1),
      auth: z.string().min(1),
    }),
  }),
  userIp: z.string().ip().optional(),
  userAgent: z.string().optional(),
  locale: z.string().min(2),
});

// Subscription with Location Schema
const subscriptionWithLocationBase = subscriptionBase.extend({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

// Create Subscription Schema
const createSubscriptionSchema = {
  body: subscriptionBase,
  response: {
    [HTTP_STATUS_CREATED]: z.object({
      id: z.number(),
      endpoint: z.string(),
      p256dhKey: z.string(),
      authKey: z.string(),
      locale: z.string(),
      expirationTime: z.string().nullable(),
      createdAt: z.date(),
    }),
  },
};

// Update Subscription Location Schema
const updateSubscriptionLocationSchema = {
  body: subscriptionWithLocationBase,
  response: {
    [HTTP_STATUS_OK]: z.object({
      id: z.number(),
      endpoint: z.string(),
      p256dhKey: z.string(),
      authKey: z.string(),
      locale: z.string(),
      expirationTime: z.string().nullable(),
      latitude: z.number().nullable(),
      longitude: z.number().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
    [HTTP_STATUS_NOT_FOUND]: z.object({
      message: z.string(),
    }),
  },
};

const subscriptionController: FastifyPluginAsyncZod<IBaseRoute> = async (app, options) => {
  const { routePrefix } = options;

  // Create/Subscribe to push notifications
  app.post(`${routePrefix}/:locale/push-notifications/subscribe`, { schema: createSubscriptionSchema }, async (request, reply) => {
    const { subscription, locale, userIp, userAgent } = request.body;
    const { endpoint, expirationTime, keys } = subscription;
    const { p256dh, auth } = keys;

    // Get user agent and IP address from request

    // Check if subscription already exists
    const existingSubscription = await PushSubscription.findOne({ where: { endpoint } });

    if (existingSubscription) {
      // Return existing subscription
      return reply.code(HTTP_STATUS_CREATED).send({
        id: existingSubscription.id,
        endpoint: existingSubscription.endpoint,
        p256dhKey: existingSubscription.p256dhKey,
        authKey: existingSubscription.authKey,
        locale: existingSubscription.locale,
        expirationTime: existingSubscription.expirationTime,
        createdAt: existingSubscription.createdAt,
      });
    }

    // Create new subscription if it doesn't exist
    const newSubscription = await PushSubscription.create({
      endpoint,
      locale,
      p256dhKey: p256dh,
      authKey: auth,
      expirationTime,
      userAgent: userAgent || null,
      ipAddress: userIp || null,
    });

    return reply.code(HTTP_STATUS_CREATED).send({
      id: newSubscription.id,
      endpoint: newSubscription.endpoint,
      p256dhKey: newSubscription.p256dhKey,
      authKey: newSubscription.authKey,
      locale: newSubscription.locale,
      expirationTime: newSubscription.expirationTime,
      createdAt: newSubscription.createdAt,
    });
  });

  // Update subscription location
  app.post(`${routePrefix}/:locale/push-notifications/send-coordinates`, { schema: updateSubscriptionLocationSchema }, async (request, reply) => {
    const { subscription, locale, latitude, longitude, userIp } = request.body;
    const { endpoint } = subscription;

    // Check if subscription exists
    const existingSubscription = await PushSubscription.findOne({ where: { endpoint } });

    if (!existingSubscription) {
      return reply.code(HTTP_STATUS_NOT_FOUND).send({
        message: "Subscription not found",
      });
    }

    // Update latitude and longitude
    const updatedSubscription = await existingSubscription.update({ latitude, longitude, locale, ipAddress: userIp || null });

    return reply.code(HTTP_STATUS_OK).send({
      id: updatedSubscription.id,
      endpoint: updatedSubscription.endpoint,
      p256dhKey: updatedSubscription.p256dhKey,
      authKey: updatedSubscription.authKey,
      locale: updatedSubscription.locale,
      expirationTime: updatedSubscription.expirationTime,
      latitude: updatedSubscription.latitude,
      longitude: updatedSubscription.longitude,
      createdAt: updatedSubscription.createdAt,
      updatedAt: updatedSubscription.updatedAt,
    });
  });
};

export default subscriptionController;
