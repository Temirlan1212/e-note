import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST" || req.body == null) {
    return res.status(400).json(null);
  }

  const pageSize = Number.isInteger(Number(req.body["pageSize"])) ? Number(req.body["pageSize"]) : 12;
  const page = Number.isInteger(Number(req.body["page"])) ? (Number(req.body["page"]) - 1) * pageSize : 0;

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.dms.db.DMSFile/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      offset: page,
      limit: pageSize,
      fields: ["fileName", "relatedModel", "metaFile.createdOn", "metaFile.fileSizeText", "metaFile.fileType"],
      data: {
        criteria: [
          {
            fieldName: "isDirectory",
            operator: "=",
            value: "false",
          },
        ],
        sortBy: req.body["sortBy"] ?? [],
      },
      ...req.body,
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
