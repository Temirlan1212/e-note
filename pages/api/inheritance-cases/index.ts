import type { NextApiRequest, NextApiResponse } from "next";

export interface IApplicationsQueryParamsData {
  _domain: string;
  _domainContext: {
    [key: string]: (number | string)[];
  };
  criteria: Record<string, any>[];
  operator: string;
}

const initialCriteria = [
  {
    fieldName: "notaryIsInheritance",
    operator: "=",
    value: true,
  },
  {
    fieldName: "saleOrderRef",
    operator: "isNull",
    value: true,
  },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const requestType = req.body["requestType"];

  let response: any = {};
  if (requestType === "fetch") response = await fetchList(req);
  if (requestType === "search") response = await fetchSearchedList(req);

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}

const fetchList = async (req: NextApiRequest) => {
  const pageSize = Number.isInteger(Number(req.body["pageSize"])) ? Number(req.body["pageSize"]) : 5;
  const page = Number.isInteger(Number(req.body["page"])) ? (Number(req.body["page"]) - 1) * pageSize : 0;

  let requestBody: {
    data?: IApplicationsQueryParamsData;
  } = {};

  const filterValues = req.body["filterValues"];
  const isFilterValueEmty = () => Object.keys(filterValues).length < 1;

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
        "barCode",
        "notaryUniqNumber",
        "requester.personalNumber",
        "requester.fullName",
        "requester.deathDate",
        "requester.birthDate",
        "requester.mainAddress.region",
        "requester.mainAddress.district",
        "requester.mainAddress.city.name",
        "requester.mainAddress.addressL4",
        "requester.mainAddress.addressL3",
        "requester.mainAddress.addressL2",
        "company.name",
        "company.notaryDistrict",
        "company.address.region",
        "company.address.district",
        "company.address.city.name",
        "company.address.addressL4",
        "company.address.addressL3",
        "company.address.addressL2",
        "requester.actualResidenceAddress.addressL2",
        "creationDate",
        "createdBy.fullName",
      ],
      data: {
        operator: "and",
        criteria: initialCriteria,
      },
      ...requestBody,
      ...req.body,
    }),
  });
  return response;
};

const fetchSearchedList = async (req: NextApiRequest) => {
  const pageSize = Number.isInteger(Number(req.body["pageSize"])) ? Number(req.body["pageSize"]) : 5;
  const page = Number.isInteger(Number(req.body["page"])) ? (Number(req.body["page"]) - 1) * pageSize : 0;
  const value = req.body["filterValues"]?.["keyWord"] || "";

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/files/full-text-search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      data: {
        offset: page,
        limit: pageSize,
        content: value,
      },
    }),
  });
  return response;
};
