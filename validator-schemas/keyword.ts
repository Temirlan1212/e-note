import * as yup from "yup";
import { InferType } from "yup";

export type IKeywordSchema = InferType<typeof keywordSchema>;

export const keywordSchema = yup.object().shape({
  keyword: yup.string().trim().min(2, "minSymbols").max(30, "maxSymbols"),
});
