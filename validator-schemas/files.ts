import { InferType, array, mixed, number, object } from "yup";

export const fileSchema = object().shape({
  file: mixed().nullable(),
});

export const filesSchema = object().shape({
  files: array().of(fileSchema),
});

export type IFilesSchema = InferType<typeof filesSchema>;
