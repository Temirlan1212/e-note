import type { NextApiRequest, NextApiResponse } from "next";

import { INotaryTypeSelections } from "@/models/notaries";

export default async function handler(req: NextApiRequest, res: NextApiResponse<INotaryTypeSelections | null>) {
  if (req.method !== "POST" && req.body == null) {
    return res.status(400).json(null);
  }

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/selection/select.company.type", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      translate: true,
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
