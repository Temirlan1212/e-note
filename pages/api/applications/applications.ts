import { IApplication, IProduct } from "@/models/applications/applications";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<IApplication | null>) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const riquredFields = [
    "qr",
    "typeNotarialAction",
    "product.fullName",
    "product.id",
    "product.name",
    "createdBy.id",
    "createdBy.fullName",
    "statusSelect",
    "creationDate",
    "createdBy",
  ];

  const fields = riquredFields.concat(req.body?.fields != null ? req.body?.fields : []);

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.sale.db.SaleOrder/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      fields,
      ...req.body,
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
