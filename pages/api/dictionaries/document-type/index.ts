import { IDocumentType } from "@/models/dictionaries/document-type";
import type { NextApiRequest, NextApiResponse } from "next";

enum criteriaFieldNames {
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
  let body: any = {};

  if (formValues != null) {
    let criteries = [];
    for (let key in criteriaFieldNames) {
      const field = key as keyof typeof criteriaFieldNames;
      const value = formValues?.[field];
      if (!value) return;

      const criteria = {
        operator: "=",
        fieldName: criteriaFieldNames[field],
        value: value ? value : null,
      };

      criteries.push(criteria);
    }

    if (criteries.length > 0) {
      body.data = {};
      body.data.operator = "and";
      body.data.criteria = criteries;
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
      ...body,
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
