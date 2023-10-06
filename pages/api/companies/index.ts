import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { notaryDistrictId } = req.query;

  if (req.method !== "GET") {
    return res.status(400).json(null);
  }

  const criteria: Record<string, string | number>[] = [];

  if (notaryDistrictId != null && typeof notaryDistrictId === "string") {
    criteria.push({
      fieldName: "notaryDistrict.id",
      operator: "=",
      value: !Number.isNaN(parseInt(notaryDistrictId)) ? parseInt(notaryDistrictId) : 0,
    });
  }

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.base.db.Company/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      fields: ["id", "version", "partner.fullName", "code", "notaryDistrict.id"],
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
