import { IUserData } from "@/models/profile/user";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<IUserData | null>) {
  if (req.method !== "POST" || req.body == null || req.body.username == null) {
    return res.status(400).json(null);
  }

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.auth.db.User/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      fields: ["email", "name", "partner.mobilePhone", "image", "group", "roles"],
      data: {
        criteria: [{ fieldName: "code", operator: "=", value: req.body.username }],
      },
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
