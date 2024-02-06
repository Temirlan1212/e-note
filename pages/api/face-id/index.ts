import type { NextApiRequest, NextApiResponse } from "next";
import { readFileSync } from "fs";
import formidable from "formidable";
import PersistentFile from "formidable/PersistentFile";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<any | null>) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const form = formidable();

  const [fields, files] = await form.parse(req);
  const file: PersistentFile[] = files.file as unknown as PersistentFile[];
  const fileInfo = file != null && file[0] != null ? file[0].toJSON() : null;

  if (fileInfo == null) {
    return res.status(400).json(null);
  }

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/face-id", {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
      "X-File-Name": fileInfo?.originalFilename ?? "",
      "X-File-Offset": "0",
      "X-File-Size": fileInfo?.size?.toString() ?? "",
      "X-File-Type": fileInfo?.mimetype ?? "",
    },
    body: await readFileSync(fileInfo.filepath),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
