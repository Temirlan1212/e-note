import type { NextApiRequest, NextApiResponse } from "next";

import { ApiNotaryResponse } from "@/models/notaries";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiNotaryResponse | null>) {
  const { id } = req.query;

  if (req.method !== "POST" && id == null) {
    return res.status(400).json(null);
  }

  const response = await fetch(process.env.BACKEND_OPEN_API_URL + `/com.axelor.apps.base.db.Company/${id}/fetch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      offset: 0,
      limit: 1,
      fields: [
        "partner",
        "typeOfNotary",
        "statusOfNotary",
        "licenseNo",
        "licenseTermFrom",
        "licenseTermUntil",
        "mobilePhone",
        "address.city",
        "address.city.name",
        "address.district",
        "address.region",
        "address.addressL4",
        "address.addressL3",
        "address.addressL2",
        "notaryDistrict.name",
        "address.fullName",
        "notaryDistrict",
        "workingDay",
        "longitude",
        "latitude",
      ],
      related: {
        partner: ["linkedUser", "mobilePhone", "email", "fullName"],
        workingDay: ["order_seq", "weekDayNumber", "startDate", "endDate"],
      },
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
