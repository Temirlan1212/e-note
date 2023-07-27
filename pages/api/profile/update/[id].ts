import type { NextApiRequest, NextApiResponse } from "next";

import { IUserData } from "@/models/profile/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse<IUserData | null>) {
  const { id } = req.query;

  if (req.method !== "POST" || req.body == null) {
    return res.status(400).json(null);
  }

  const response = await fetch(process.env.BACKEND_API_URL + `/ws/rest/com.axelor.auth.db.User/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      data: req.body,
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
