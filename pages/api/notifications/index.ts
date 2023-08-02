import { IUserNotification } from "@/models/notifications/user-notification";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<IUserNotification | null>) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }
  const criteria = req.body["criteria"];
  const operator = req.body["operator"];
  const sortBy = req.body["sortBy"];

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.base.db.Product/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      offset: 0,
      limit: 5,
      fields: ["version", "isArchived", "isRead", "isStarred", "message", "message.body", "userId"],
      sortBy: sortBy ?? [],
      data: {
        operator: operator,
        criteria: criteria,
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
