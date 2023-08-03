import { ISubjectData } from "@/models/black-list/subject-data";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ISubjectData | null>) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const operator = req.body["operator"];
  const searchType = req.body["searchType"];
  const values = req.body["values"];
  const field = req.body["fieldName"];

  const fieldsToSearch: Array<{ fieldName: string; operator: string; value: string | null }> = [];

  if (searchType === "keyword") {
    fieldsToSearch.push(
      { fieldName: "createdBy.fullName", operator: "like", value: `%${values.keywordValue}%` },
      { fieldName: "partner.fullName", operator: "like", value: `%${values.keywordValue}%` },
      { fieldName: "partner.personalNumber", operator: "like", value: `%${values.keywordValue}%` },
      { fieldName: "blockingReason.name", operator: "like", value: `%${values.keywordValue}%` }
    );
  }

  if (searchType === "criteria") {
    if (values.reasonValue !== "") {
      fieldsToSearch.push({ fieldName: "blockingReason.name", operator: "like", value: `%${values.reasonValue}%` });
    }

    if (values.pinValue !== "") {
      fieldsToSearch.push({ fieldName: "partner.personalNumber", operator: "like", value: `%${values.pinValue}%` });
    }

    if (values.fullNameValue !== "") {
      fieldsToSearch.push({ fieldName: "partner.fullName", operator: "like", value: `%${values.fullNameValue}%` });
    }
  }

  if (searchType === "filter") {
    if (values.searchedValue !== "") {
      fieldsToSearch.push({ fieldName: field, operator: "like", value: `%${values.searchedValue}%` });
    }
  }

  const criteria = fieldsToSearch;

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
