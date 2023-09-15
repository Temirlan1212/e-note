import type { NextApiRequest, NextApiResponse } from "next";

import { INotarySelections } from "@/models/notaries";

export default async function handler(req: NextApiRequest, res: NextApiResponse<INotarySelections | null>) {
  if (req.method !== "POST" && req.body == null) {
    return res.status(400).json(null);
  }

  const optionName = req.body["optionName"];
  const optionId = req.body["optionId"];

  const data: any =
    optionName && optionId
      ? {
          _domain: `self.${optionName}.id = :${optionName}`,
          _domainContext: {
            [optionName]: optionId,
          },
        }
      : {};

  const response = await fetch(
    process.env.BACKEND_OPEN_API_URL + "/search/axelor-erp/com.axelor.apps.base.db.District",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: ["name"],
        data: data,
      }),
    }
  );

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
