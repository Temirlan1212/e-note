import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "PUT" || id == null) {
    return res.status(400).json(null);
  }

  const application = await fetch(
    process.env.BACKEND_API_URL + `/ws/rest/com.axelor.apps.sale.db.SaleOrder/${id}/fetch`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers["server-cookie"]?.toString() ?? "",
      },
      body: JSON.stringify({
        fields: ["id", "version"],
      }),
    }
  );

  const applicationData = await application.json();
  if (applicationData?.status === 0 && !!application?.ok) {
    const version = applicationData?.data?.[0]?.version;
    if (!!version) req.body = { ...req.body, version };
  }

  const response = await fetch(process.env.BACKEND_API_URL + `/ws/rest/com.axelor.apps.sale.db.SaleOrder/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      fields: ["id", "version"],
      data: req.body,
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
