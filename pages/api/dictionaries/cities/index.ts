import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { districtId } = req.query;

  if (req.method !== "GET") {
    return res.status(400).json(null);
  }

  const criteria = [];

  if (districtId != null && typeof districtId === "string") {
    criteria.push({
      fieldName: "district.id",
      operator: "=",
      value: !Number.isNaN(parseInt(districtId)) ? parseInt(districtId) : 0,
    });
  }

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.base.db.City/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      fields: ["id", "version", "name", "district.id", "zip"],
      data: {
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
