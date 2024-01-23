import type { NextApiRequest, NextApiResponse } from "next";

import { ApiNotaryResponse } from "@/models/notaries";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiNotaryResponse | null>) {
  const { id } = req.query;

  if (req.method !== "GET" && id == null) {
    return res.status(400).json(null);
  }

  const response = await fetch(process.env.BACKEND_OPEN_API_URL + `/com.axelor.apps.base.db.Company/${id}`, {
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
