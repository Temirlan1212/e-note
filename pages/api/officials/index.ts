import { IOfficialsData } from "@/models/omsu-officials/officials-data";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<IOfficialsData | null>) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  let API_URL = process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.base.db.Partner/search";

  const requestType = req.body["requestType"];
  const searchValue = req.body["searchValue"];
  const roleValue = req.body["roleValue"];
  const fileName = req.body["fileName"];

  const fields = [
    "lastName",
    "firstName",
    "middleName",
    "notaryPosition",
    "birthDate",
    "mobilePhone",
    "emailAddress.address",
    "simpleFullName",
    "notaryWorkOrder",
    "notaryCriminalRecord",
  ];

  const criteria: Array<{
    fieldName?: string;
    operator: string;
    value?: string | null;
    criteria?: Record<string, any>;
  }> = [];

  criteria.push({
    fieldName: "user.roles.name",
    operator: "=",
    value: roleValue,
  });

  if (requestType === "search") {
    const fieldsToSearch = fields.map((field) => ({
      fieldName: field,
      operator: "like",
      value: `%${searchValue}%`,
    }));

    criteria.push({
      operator: "or",
      criteria: fieldsToSearch,
    });
  }

  if (requestType === "export") {
    API_URL += "/export/";
  }

  if (requestType === "download") {
    API_URL += `/export/${fileName}`;
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      offset: 0,
      limit: 100,
      field: fields,
      data: {
        operator: "and",
        criteria: criteria,
      },
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
