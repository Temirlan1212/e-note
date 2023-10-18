import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(400).json(null);
  }

  const companyId = req.body["companyId"];
  const requesterId = req.body["requesterId"];
  const applicationId = req.body["applicationId"];
  const grade = req.body["grade"];

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.sale.db.Rating", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      data: {
        saleOrder: {
          id: applicationId,
        },
        company: {
          id: companyId,
        },
        partner: {
          id: requesterId,
        },
        grade: grade,
      },
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
