import type { NextApiRequest, NextApiResponse } from "next";

export interface IApplicationsQueryParamsData {
  _domain: string;
  _domainContext: {
    [key: string]: (number | string)[];
  };
}

interface Criteria {
  value: any;
  fieldName: string;
  operator: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const pageSize = Number.isInteger(Number(req.body["pageSize"])) ? Number(req.body["pageSize"]) : 5;
  const page = Number.isInteger(Number(req.body["page"])) ? (Number(req.body["page"]) - 1) * pageSize : 0;
  const filterValues = req.body["filterValues"];
  const searchValue = req.body["searchValue"];
  const currentUser = req.body["currentUser"];
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

  const searchedFields = ["documentAction", "applicant1", "applicant2"];

  const buildCriteria = () => {
    const inCriteria: Criteria[] = [];
    const criteria = [
      {
        operator: "and",
        criteria: [
          {
            operator: "or",
            criteria: [
              {
                fieldName: "company",
                operator: "like",
                value: currentUser,
              },
            ],
          },
          {
            operator: "or",
            criteria: inCriteria,
          },
        ],
      },
    ];

    if (searchValue != null) {
      for (const field of searchedFields) {
        inCriteria.push({
          fieldName: field,
          operator: "like",
          value: searchValue,
        });
      }
    }
    return criteria;
  };

  const response = await fetch(
    process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.sale.db.ArchiveOfSaleOrder/search",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers["server-cookie"]?.toString() ?? "",
      },
      body: JSON.stringify({
        offset: page,
        limit: pageSize,
        fields: ["documentAction", "createdDate", "applicant1", "applicant2", "company"],
        data: {
          criteria: buildCriteria(),
        },
        sortBy: req.body["sortBy"] ?? [],
      }),
    }
  );

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
