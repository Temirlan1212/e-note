import type { NextApiRequest, NextApiResponse } from "next";
import { IApplicationsQueryParamsData } from "@/pages/api/applications-archive";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const criteria = req.body["criteria"] ?? [];
  const domainVal = req.body["domainVal"] ?? {};
  const isFilterValueEmty = () => Object.keys(domainVal).length < 1;

  const requestBody: {
    data?: IApplicationsQueryParamsData;
  } = {};

  if (!isFilterValueEmty()) {
    const _domain = "self.notaryUniqNumber = :notaryUniqNumber";

    const _domainContext = {
      notaryUniqNumber: domainVal,
    };

    requestBody.data = { _domain, _domainContext };
  }

  const response = await fetch(process.env.BACKEND_OPEN_API_URL + "/search/com.axelor.apps.sale.db.SaleOrder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        criteria,
      },
      ...requestBody,
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
