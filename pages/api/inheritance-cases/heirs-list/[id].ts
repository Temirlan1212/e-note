import type { NextApiRequest, NextApiResponse } from "next";

export interface IApplicationsQueryParamsData {
  _domain: string;
  _domainContext: {
    [key: string]: (number | string)[];
  };
  criteria: Record<string, any>[];
  operator: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "POST" && id == null) {
    return res.status(400).json(null);
  }

  const initialCriteria = [
    {
      fieldName: "saleOrderRef.id",
      operator: "=",
      value: id,
    },
  ];

  const pageSize = Number.isInteger(Number(req.body["pageSize"])) ? Number(req.body["pageSize"]) : 5;
  const page = Number.isInteger(Number(req.body["page"])) ? (Number(req.body["page"]) - 1) * pageSize : 0;
  const filterValues = req.body["filterValues"];
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

    requestBody.data = { _domain, _domainContext, criteria: initialCriteria, operator: "and" };
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
      sortBy: req.body["sortBy"] ?? [],
      fields: [
        "requester.personalNumber",
        "requester.fullName",
        "requester.relationships.relationshipType",
        "createdOn",
        "requester.id",
        "requester.mainAddress.region",
        "requester.mainAddress.district",
        "requester.mainAddress.city.name",
        "requester.mainAddress.addressL4",
        "requester.mainAddress.addressL3",
        "requester.mainAddress.addressL2",
        "requester.mobilePhone",
      ],
      data: {
        operator: "and",
        criteria: [
          {
            fieldName: "saleOrderRef.id",
            operator: "=",
            value: 24797,
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
