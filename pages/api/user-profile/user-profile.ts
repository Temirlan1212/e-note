import { IStatus } from "@/models/dictionaries/status";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<IStatus | null>) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const response = await fetch(process.env.BACKEND_API_URL + "com.axelor.auth.db.User", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify(req.body),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
