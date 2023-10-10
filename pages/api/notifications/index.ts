import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any | null>) {
  const { userId } = req.query;
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const pageSize = Number.isInteger(Number(req.body["pageSize"])) ? Number(req.body["pageSize"]) : 5;
  const criteria: Record<string, string | boolean | number>[] = [];

  if (typeof userId === "string") {
    criteria.push(
      {
        fieldName: "user.id",
        operator: "=",
        value: !Number.isNaN(parseInt(userId)) ? parseInt(userId) : 0,
      },
      {
        fieldName: "message.subject",
        operator: "!=",
        value: "Quotation/sale order created",
      },
      {
        fieldName: "isArchived",
        operator: "=",
        value: false,
      }
    );
  }

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
      sortBy: ["-createdOn"],
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
