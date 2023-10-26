import type { NextApiRequest, NextApiResponse } from "next";

interface ITemplatesQueryParamsData {
  _domain: string;
  _domainContext: {
    [key: string]: (number | string)[];
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const pageSize = Number.isInteger(Number(req.body["pageSize"])) ? Number(req.body["pageSize"]) : 5;
  const page = Number.isInteger(Number(req.body["page"])) ? (Number(req.body["page"]) - 1) * pageSize : 0;
  const filterValues = req.body["filterValues"];
  const searchValue = req.body["searchValue"];
  const isFilterValueEmpty = () => Object.keys(filterValues).length < 1;

  const requestBody: {
    data?: ITemplatesQueryParamsData;
  } = {};

  if (!isFilterValueEmpty()) {
    const _domain = Object.keys(filterValues)
      .map((key) => `self.${key} in :${key.replace(/[.\s]/g, "")}`)
      .join(" and ");

    const _domainContext = Object.fromEntries(
      Object.entries(filterValues).map(([key, value]) => [key.replace(/[.\s]/g, ""), value])
    ) as ITemplatesQueryParamsData["_domainContext"];

    requestBody.data = { _domain, _domainContext };
  }

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.base.db.Product/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      offset: page,
      limit: pageSize,
      sortBy: req.body["sortBy"] ?? [],
      data: {
        criteria: [
          {
            operator: "and",
            criteria: [
              {
                fieldName: "name",
                operator: "like",
                value: `%${searchValue}%`,
              },
            ],
          },
        ],
      },
      ...requestBody,
      ...req.body,
      translate: true,
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
