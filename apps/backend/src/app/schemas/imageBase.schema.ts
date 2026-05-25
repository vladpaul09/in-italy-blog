import z from "zod";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "../../config/fileSystem.config";

export const imageBaseCreateType = z
  .string()
  .refine((val) => ACCEPTED_IMAGE_TYPES.includes(val.split(";")[0].split(":")[1]), "Only .jpg, .jpeg, .png, and .webp formats are supported.")
  .refine((val) => Buffer.from(val.split(",")[1], "base64").length <= MAX_FILE_SIZE, `Max image size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`)
  .transform((val) => ({
    type: val.split(";")[0].split(":")[1],
    buffer: Buffer.from(val.split(",")[1], "base64"),
  }));

export const imageBaseEditType = z
  .string()
  .optional()
  .nullable()
  .refine((val) => !val || ACCEPTED_IMAGE_TYPES.includes(val.split(";")[0].split(":")[1]), "Only .jpg, .jpeg, .png, and .webp formats are supported.")
  .refine((val) => !val || Buffer.from(val.split(",")[1], "base64").length <= MAX_FILE_SIZE, `Max image size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`)
  .transform((val) => {
    if (!val) return undefined; // If no image provided, return undefined
    return {
      type: val.split(";")[0].split(":")[1],
      buffer: Buffer.from(val.split(",")[1], "base64"),
    };
  });
