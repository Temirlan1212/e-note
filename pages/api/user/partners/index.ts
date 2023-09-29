import type { NextApiRequest, NextApiResponse } from "next";

interface Criteria {
  value: any;
  fieldName: string;
  operator: string;
}

export interface IUserRegistryFilterData {
  createdOn: {
    value: string;
    value2: string;
  };
  role: string;
  createdBy: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const pageSize = Number.isInteger(Number(req.body["pageSize"])) ? Number(req.body["pageSize"]) : 8;
  const page = Number.isInteger(Number(req.body["page"])) ? (Number(req.body["page"]) - 1) * pageSize : 0;

  const searchValue = req.body["searchValue"];
  const filterData = req.body["filterData"];
  const sortBy = req.body["sortBy"];

  const buildFilterCriteria = (filterData: IUserRegistryFilterData) => {
    const criteria: Criteria[] = [];
    if (filterData !== null) {
      const fieldsMap = {
        createdOn: "createdOn",
        role: "user.roles.name",
        createdBy: "emailAddress.address",
      };

      for (const field in fieldsMap) {
        const key = field as keyof typeof fieldsMap;
        if (filterData[key] !== null) {
          criteria.push({
            fieldName: fieldsMap[key],
            operator: "=",
            value: filterData[key],
          });
        }
      }
    }

    return criteria;
  };

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
        "user.blocked",
        "user.id",
        "user.version",
      ],
      data: {
        _domain: "self.user.blocked = :personalNumber",
        _domainContext: {
          personalNumber: "false",
        },
        sortBy,
        operator: "and",
        criteria: [
          {
            operator: "and",
            criteria: buildFilterCriteria(filterData),
          },
          {
            fieldName: "fullName",
            operator: "like",
            value: searchValue ?? "",
          },
        ],
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
