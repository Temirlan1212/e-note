import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { districtId, cityId } = req.query;

  if (req.method !== "GET") {
    return res.status(400).json(null);
  }

  const criteria: Record<string, string | number>[] = [];

  if (cityId != null && typeof cityId === "string") {
    criteria.push({
      fieldName: "city.id",
      operator: "=",
      value: !Number.isNaN(parseInt(cityId)) ? parseInt(cityId) : 0,
    });
  }

  if (districtId != null && typeof cityId === "string") {
    if (typeof districtId === "string") {
      criteria.push({
        fieldName: "district.id",
        operator: "=",
        value: !Number.isNaN(parseInt(districtId)) ? parseInt(districtId) : 0,
      });
    }
  }

  const response = await fetch(process.env.BACKEND_OPEN_API_URL + "/search/com.axelor.apps.notary.db.NotaryDistrict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      fields: ["id", "version", "name", "city.id"],
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
