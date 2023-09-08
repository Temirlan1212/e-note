import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any | null>) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const pageSize = Number.isInteger(Number(req.body["pageSize"])) ? Number(req.body["pageSize"]) : 5;
  const criteria = req.body["criteria"];

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.mail.db.MailFlags/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      offset: 0,
      limit: pageSize,
      fields: ["version", "isArchived", "isRead", "isStarred", "message", "message.body", "userId", "createdOn"],
      sortBy: ["-id"],
      data: {
        operator: "and",
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
