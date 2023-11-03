import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { parentId, actionType } = req.query;

  if (req.method !== "POST" || actionType == null) {
    return res.status(400).json(null);
  }
  const criteria = [
    {
      fieldName: "notaryActionType",
      operator: "=",
      value: actionType,
    },
  ];

  if (parentId != null) {
    criteria.push({
      fieldName: "parent.id",
      operator: "=",
      value: parentId,
    });
  }

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.notary.db.NotaryAction/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      fields: ["name", "nameInKg", "nameInRu", "nameInEn"],
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
