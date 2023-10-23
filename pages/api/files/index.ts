import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST" || req.body == null) {
    return res.status(400).json(null);
  }

  const pageSize = Number.isInteger(Number(req.body["pageSize"])) ? Number(req.body["pageSize"]) : 12;
  const page = Number.isInteger(Number(req.body["page"])) ? (Number(req.body["page"]) - 1) * pageSize : 0;
  const operator = req.body["operator"];

  const criteria = Object.entries(req.body?.filters ?? {}).reduce((acc: Record<string, any>[], [key, value]) => {
    if (value && key) {
      acc.push({ fieldName: key, operator: operator ?? "=", value });
    }
    return acc;
  }, []);

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.meta.db.MetaFile/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      offset: page,
      limit: pageSize,
      sortBy: req.body["sortBy"] ?? [],
      fields: ["fileName", "filePath", "fileType", "sizeText", "createdOn"],
      data: {
        operator: "and",
        criteria: [
          {
            fieldName: "fileName",
            operator: "notLike",
            value: "SaleOrderQRCode_",
          },
          ...criteria,
        ],
      },
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
