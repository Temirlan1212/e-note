import { IDocumentType } from "@/models/dictionaries/document-type";
import type { NextApiRequest, NextApiResponse } from "next";

enum criteriaFieldNames {
  isSystem = "isSystem",
  "createdBy.id" = "createdBy.id",
  object = "notaryObject",
  objectType = "notaryObjectType",
  notarialAction = "notaryAction",
  typeNotarialAction = "notaryActionType",
  action = "notaryRequestAction",
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<IDocumentType | null>) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const formValues = req.body?.["formValues"];
  const criteria: Record<string, string | number>[] = [];

  if (formValues != null) {
    for (let key in criteriaFieldNames) {
      const field = key as keyof typeof criteriaFieldNames;
      const value = formValues?.[field];
      if (!value) continue;

      criteria.push({
        fieldName: criteriaFieldNames[field],
        operator: "=",
        value: value ? value : null,
      });
    }
  }

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.base.db.Product/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      offset: 0,
      limit: 100,
      fields: ["name", "fullName"],
      translate: true,
      data: {
        operator: "and",
        criteria,
      },
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
