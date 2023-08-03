import { ISubjectData } from "@/models/black-list/subject-data";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ISubjectData | null>) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const criteria = req.body["criteria"];
  const operator = req.body["operator"];

  if (req.body["fieldName"] && req.body["value"]) {
    const fieldCriterion = {
      fieldName: req.body["fieldName"],
      operator: "like",
      value: req.body["value"],
    };
    criteria.push(fieldCriterion);
  }

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.base.db.Blocking/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      offset: 0,
      limit: 10,
      fields: [
        "partner.personalNumber",
        "partner.birthDate",
        "partner.fullName",
        "createdOn",
        "createdBy.fullName",
        "blockingReason.name",
      ],
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
