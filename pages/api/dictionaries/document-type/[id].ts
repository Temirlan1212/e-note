import type { NextApiRequest, NextApiResponse } from "next";

export enum criteriaFieldNames {
  isSystem = "isSystem",
  createdBy = "createdBy.id",
  action = "notaryAction.id",
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method !== "POST" || id == null) {
    return res.status(400).json(null);
  }

  const response = await fetch(process.env.BACKEND_API_URL + `/ws/rest/com.axelor.apps.base.db.Product/${id}/fetch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      fields: ["object", "objectType", "typeNotarialAction", "notarialAction", "notaryAction"],
      translate: true,
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
