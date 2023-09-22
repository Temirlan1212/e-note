import type { NextApiRequest, NextApiResponse } from "next";

import { INotaryTypeSelections } from "@/models/notaries";

export default async function handler(req: NextApiRequest, res: NextApiResponse<INotaryTypeSelections | null>) {
  if (req.method !== "GET" && req.body == null) {
    return res.status(400).json(null);
  }

  const response = await fetch(process.env.BACKEND_OPEN_API_URL + "/selection/axelor-erp/select.company.working.day", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
