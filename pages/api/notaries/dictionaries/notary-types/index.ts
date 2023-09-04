import type { NextApiRequest, NextApiResponse } from "next";

import { INotaryTypeSelections } from "@/models/notaries/notary";

export default async function handler(req: NextApiRequest, res: NextApiResponse<INotaryTypeSelections | null>) {
  if (req.method !== "GET" && req.body == null) {
    return res.status(400).json(null);
  }

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/selection/select.company.type", {
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
