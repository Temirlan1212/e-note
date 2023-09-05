import type { NextApiRequest, NextApiResponse } from "next";

import { INotaryData } from "@/models/notaries";

export default async function handler(req: NextApiRequest, res: NextApiResponse<INotaryData | null>) {
  if (req.method !== "POST" && req.body == null) {
    return res.status(400).json(null);
  }

  const pageSize = Number.isInteger(Number(req.body["pageSize"])) ? Number(req.body["pageSize"]) : 8;
  const page = Number.isInteger(Number(req.body["page"])) ? (Number(req.body["page"]) - 1) * pageSize : 0;

  const criteria: any[] = [];
  let data: any = {};

  const radioValue = req.body["radioValue"];
  const requestType = req.body["requestType"];
  const searchValue = req.body["searchValue"];

  if (requestType === "keywordSearch") {
    data = {
      operator: "and",
      criteria: [
        {
          fieldName: "name",
          operator: "like",
          value: searchValue,
        },
      ],
    };
  }

  const radioChecked = () => {
    if (radioValue === "roundClock") {
      return [
        {
          fieldName: "roundClock",
          operator: "=",
          value: true,
        },
        {
          fieldName: "checkOut",
          operator: "=",
          value: false,
        },
      ];
    } else if (radioValue === "checkOut") {
      return [
        {
          fieldName: "roundClock",
          operator: "=",
          value: false,
        },
        {
          fieldName: "checkOut",
          operator: "=",
          value: true,
        },
      ];
    } else {
      return [];
    }
  };

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.base.db.Company/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      offset: page,
      limit: pageSize,
      fields: [
        "partner.simpleFullName",
        "partner.rating",
        "logo.fileName",
        "address.region",
        "address.district",
        "address.city",
      ],
      // data: {
      //   criteria: req.body["criteria"] ?? [],
      //   sortBy: req.body["sortBy"] ?? [],
      // },
      data: data,
      ...req.body,
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
