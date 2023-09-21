import type { NextApiRequest, NextApiResponse } from "next";
import { Criteria, Data } from "@/components/notaries/NotariesContent";
import { IUserRegistryCriteria, IUserRegistryFilterData } from "@/components/user-registry/UserRegistryContent";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const pageSize = Number.isInteger(Number(req.body["pageSize"])) ? Number(req.body["pageSize"]) : 8;
  const page = Number.isInteger(Number(req.body["page"])) ? (Number(req.body["page"]) - 1) * pageSize : 0;

  const criteria: IUserRegistryCriteria[] = [];
  let data: Data = {};

  const requestType = req.body["requestType"];
  const searchValue = req.body["searchValue"];
  const requestData = req.body["requestData"];
  const sortBy = req.body["sortBy"];

  const buildFilterCriteria = (filterData: IUserRegistryFilterData) => {
    if (filterData.createdOn !== null) {
      criteria.push({
        fieldName: "createdOn",
        operator: "between",
        value: filterData.createdOn.value,
        value2: filterData.createdOn.value2,
      });
    }

    if (filterData.role !== null) {
      criteria.push({
        fieldName: "user.roles.name",
        operator: "=",
        value: filterData.role,
      });
    }

    if (filterData.createdBy !== null) {
      criteria.push({
        fieldName: "emailAddress.address",
        operator: "=",
        value: filterData.createdBy,
      });
    }

    return criteria;
  };

  if (requestType === "keywordSearch") {
    data = {
      criteria: [
        {
          fieldName: "fullName",
          operator: "like",
          value: searchValue,
        },
      ],
    };
  }

  if (requestType === "filterSearch") {
    const newArr = buildFilterCriteria(requestData);
    data = {
      criteria: newArr,
      operator: "and",
    };
  }

  if (requestType === "sortBy") {
    data = {
      criteria: criteria ?? [],
      sortBy: sortBy ?? [],
    };
  }

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.base.db.Partner/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      offset: page,
      limit: pageSize,
      fields: [
        "fullName",
        "user.roles.name",
        "user.code",
        "personalNumber",
        "mobilePhone",
        "user.email",
        "createdOn",
        "emailAddress.address",
      ],
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
