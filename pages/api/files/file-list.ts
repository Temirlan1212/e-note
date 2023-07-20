import { IFileList } from "@/models/files/file-list";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<IFileList | null>) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.dms.db.DMSFile/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      offset: 0,
      limit: 10,
      fields: ["fileName", "relatedModel", "metaFile.createdOn", "metaFile.fileSizeText", "metaFile.fileType"],
      data: {
        criteria: [],
        sortBy: ["metaFile.createdOn"],
      },
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
