import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { cityId } = req.query;

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

  const response = await fetch(
    process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.notary.db.NotaryDistrict/search",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers["server-cookie"]?.toString() ?? "",
      },
      body: JSON.stringify({
        fields: ["id", "version", "name", "city.id", "company"],
        data: {
          criteria,
        },
      }),
    }
  );

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
