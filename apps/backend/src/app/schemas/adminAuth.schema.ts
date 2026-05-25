import z from "zod";
import { HTTP_STATUS_OK, HTTP_STATUS_CREATED, HTTP_STATUS_UNAUTHORIZED } from "../../config/httpStatus.config";

export const loginSchema = {
  body: z.object({
    username: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .email(),
    password: z.string().min(4),
  }),
  response: {
    [HTTP_STATUS_CREATED]: z.array(
      z.object({
        resource: z.string(),
        action: z.string(),
      })
    ),
    [HTTP_STATUS_UNAUTHORIZED]: z.object({ message: z.string() }),
  },
};

export const checkAuthSchema = {
  response: {
    [HTTP_STATUS_OK]: z.boolean(),
    [HTTP_STATUS_UNAUTHORIZED]: z.object({ message: z.string() }),
  },
};

export const logoutSchema = {
  response: {
    [HTTP_STATUS_OK]: z.object({
      message: z.string(),
    }),
    [HTTP_STATUS_UNAUTHORIZED]: z.object({ message: z.string() }),
  },
};
