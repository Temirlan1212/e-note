import { IOfficialsData } from "@/models/omsu-officials/officials-data";
import type { NextApiRequest, NextApiResponse } from "next";

type CriteriaItem = {
  fieldName: string;
  operator: string;
  value: string;
};

type Criteria =
  | CriteriaItem
  | {
      operator: string;
      criteria: CriteriaItem[];
    };

export default async function handler(req: NextApiRequest, res: NextApiResponse<IOfficialsData | null>) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const pageSize = Number.isInteger(Number(req.body["pageSize"])) ? Number(req.body["pageSize"]) : 5;
  const page = Number.isInteger(Number(req.body["page"])) ? (Number(req.body["page"]) - 1) * pageSize : 0;

  let API_URL = process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.base.db.Partner";

  const filterValues = req.body["filterValues"];
  const requestType = req.body["requestType"];
  const roleValue = req.body["roleValue"];

  let criteria: Criteria[] = [
    {
      fieldName: "user.roles.name",
      operator: "=",
      value: roleValue,
    },
  ];

  if (requestType === "getAllData") {
    API_URL += "/search";
  }

  if (requestType === "export") {
    API_URL += "/export/";
  }

  if (requestType === "searchFilter") {
    API_URL += "/search";

    const keys = Object.keys(filterValues);
    const values = Object.values(filterValues);

    criteria = [
      {
        fieldName: "user.roles.name",
        operator: "=",
        value: roleValue,
      },
      {
        operator: "and",
        criteria: keys.map((key, index) => ({
          fieldName: key,
          operator: "like",
          value: `%${values[index]}%`,
        })),
      },
    ];
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      offset: page,
      limit: pageSize,
      field: [
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
      ],
      sortBy: req.body["sortBy"] ?? [],
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
