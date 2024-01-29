import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import PersistentFile from "formidable/PersistentFile";
import { readFileSync } from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const form = formidable();

  const [fields, files] = await form.parse(req);
  const id = fields.id as string;
  const editReason = fields.editReason as string;
  const fileName = fields.fileName as string;
  const file: PersistentFile[] = files.file as unknown as PersistentFile[];
  const fileInfo = file != null && file[0] != null ? file[0].toJSON() : null;

  if (fileInfo == null) {
    return res.status(400).json(null);
  }

  const arrayBuffer = await readFileSync(fileInfo.filepath);

  const scan = new File([arrayBuffer], fileName, { type: "application/pdf" });

  const formData = new FormData();
  formData.append("id", id);
  formData.append("editReason", editReason);
  formData.append("fileName", fileName);
  formData.append("scan", scan);

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/file/editSignedDoc", {
    method: "POST",
    headers: {
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: formData,
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
