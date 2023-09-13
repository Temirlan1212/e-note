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

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.base.db.District/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      fields: ["name"],
      data: data,
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
