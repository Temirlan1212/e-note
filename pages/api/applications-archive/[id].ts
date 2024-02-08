import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "POST" || id == null) {
    return res.status(400).json(null);
  }

  const fields = req.body.fields;

  const response = await fetch(
    process.env.BACKEND_API_URL + `/ws/rest/com.axelor.apps.sale.db.ArchiveOfSaleOrder/${id}/fetch`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers["server-cookie"]?.toString() ?? "",
      },
      body: JSON.stringify({
        fields: fields ?? ["reportContent", "company"],
      }),
    }
  );

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
