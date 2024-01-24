import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const { keyWord, birthDate, deathDate } = req.body.requestData;
  console.log(req.body.data);
  const buildCriteria = () => {
    const criteria = [];

    if (keyWord) {
      criteria.push({
        fieldName: "requester.fullName",
        operator: "like",
        value: `%${keyWord}%`,
      });
    }

    if (birthDate) {
      criteria.push({
        fieldName: "requester.birthDate",
        operator: "=",
        value: birthDate,
      });
    }

    if (deathDate) {
      criteria.push({
        fieldName: "requester.deathDate",
        operator: "=",
        value: deathDate,
      });
    }

    return criteria;
  };

  const response = await fetch(process.env.BACKEND_OPEN_API_URL + "/search/com.axelor.apps.sale.db.SaleOrder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      fields: [
        "notaryUniqNumber",
        "requester.fullName",
        "requester.deathDate",
        "company.name",
        "company.id",
        "requester.birthDate",
      ],
      data: {
        criteria: [
          {
            operator: "and",
            criteria: [
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
              {
                operator: "or",
                criteria: buildCriteria(),
              },
            ],
          },
        ],
      },
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
