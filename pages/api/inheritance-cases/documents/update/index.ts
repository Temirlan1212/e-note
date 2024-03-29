import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<null>) {
  const { model, id } = req.query;
  const filesId = req.body?.["filesId"];

  if (req.method !== "PUT" || id == null || filesId == null) {
    return res.status(400).json(null);
  }

  const response = await fetch(
    `${process.env.BACKEND_API_URL}/ws/dms/attachments/com.axelor.apps.sale.db.SaleOrder/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers["server-cookie"]?.toString() ?? "",
      },
      body: JSON.stringify({
        records: filesId,
      }),
    }
  );

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
