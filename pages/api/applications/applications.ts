import { IApplication } from "@/models/applications/applications";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<IApplication | null>) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const pageSize = Number.isInteger(Number(req.body["pageSize"])) ? Number(req.body["pageSize"]) : 12;
  const page = Number.isInteger(Number(req.body["page"])) ? (Number(req.body["page"]) - 1) * pageSize : 0;

  const filterValues = req.body.data["filterValues"];
  const _domain = Object.keys(filterValues)
    .map((key) => `self.${key} in :${key.replace(/[.\s]/g, "")}`)
    .join(" and ");

  const SQLRequest = {
    _domain,
    _domainContext: filterValues,
  };

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.sale.db.SaleOrder/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      offset: page,
      limit: pageSize,
      fields: [
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
      ],
      ...req.body,
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
