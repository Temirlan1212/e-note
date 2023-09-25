import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { regionId } = req.query;

  if (req.method !== "GET") {
    return res.status(400).json(null);
  }

  const criteria: Record<string, string | number>[] = [];

  if (regionId != null && typeof regionId === "string") {
    criteria.push({
      fieldName: "region.id",
      operator: "=",
      value: !Number.isNaN(parseInt(regionId)) ? parseInt(regionId) : 0,
    });
  }

  const response = await fetch(
    process.env.BACKEND_OPEN_API_URL + "/search/axelor-erp/com.axelor.apps.base.db.District",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers["server-cookie"]?.toString() ?? "",
      },
      body: JSON.stringify({
        fields: ["id", "version", "name", "region.id", "code"],
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
