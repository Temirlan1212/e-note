import type { NextApiRequest, NextApiResponse } from "next";

export interface IApplicationsQueryParamsData {
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
  const isFilterValueEmty = () => Object.keys(filterValues).length < 1;

  const requestBody: {
    data?: IApplicationsQueryParamsData;
  } = {};

  if (!isFilterValueEmty()) {
    const _domain = Object.keys(filterValues)
      .map((key) => `self.${key} in :${key.replace(/[.\s]/g, "")}`)
      .join(" and ");

    const _domainContext = Object.fromEntries(
      Object.entries(filterValues).map(([key, value]) => [key.replace(/[.\s]/g, ""), value])
    ) as IApplicationsQueryParamsData["_domainContext"];

    requestBody.data = { _domain, _domainContext };
  }

  const criteria = [];

  if (searchValue) {
    criteria.push({
      fieldName: "requester.fullName",
      operator: "like",
      value: searchValue,
    });
    criteria.push({
      fieldName: "members.fullName",
      operator: "like",
      value: searchValue,
    });
    criteria.push({
      fieldName: "notaryUniqNumber",
      operator: "=",
      value: searchValue,
    });
  }

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.sale.db.SaleOrder/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      offset: page,
      limit: pageSize,
      fields: [
        "qr",
        "typeNotarialAction",
        "product.fullName",
        "product.id",
        "product.name",
        "createdBy.id",
        "createdBy.fullName",
        "statusSelect",
        "creationDate",
        "createdBy",
        "company.name",
        "uniqueQrCode",
        "notaryUniqNumber",
        "members.fullName",
        "requester.fullName",
      ],
      sortBy: req.body["sortBy"] ?? [],
      data: {
        criteria: [
          {
            operator: "or",
            criteria,
          },
        ],
      },
      ...requestBody,
      ...req.body,
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
