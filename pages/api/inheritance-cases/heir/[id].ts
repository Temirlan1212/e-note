import type { NextApiRequest, NextApiResponse } from "next";

import { ApiNotaryResponse } from "@/models/notaries";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiNotaryResponse | null>) {
  const { id } = req.query;

  if (req.method !== "POST" && id == null) {
    return res.status(400).json(null);
  }

  const response = await fetch(process.env.BACKEND_API_URL + `/ws/rest/com.axelor.apps.base.db.Partner/${id}/fetch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      fields: [
        "lastName",
        "firstName",
        "middleName",
        "birthDate",
        "personalNumber",
        "deathDate",
        "birthDate",
        "citizenship",
        "nationality",
        "familyStatus",
        "identityDocument",
        "passportSeries",
        "passportNumber",
        "authority",
        "authorityNumber",
        "dateOfIssue",
        "relationships",
        "maritalStatus",
        "foreigner",
        "mainAddress.region",
        "mainAddress.district",
        "mainAddress.city.name",
        "mainAddress.addressL4",
        "mainAddress.addressL3",
        "mainAddress.addressL2",
        "actualResidenceAddress.region",
        "actualResidenceAddress.district",
        "actualResidenceAddress.city.name",
        "actualResidenceAddress.addressL4",
        "actualResidenceAddress.addressL3",
        "actualResidenceAddress.addressL2",
        "foreignAddress",
        "mobilePhone",
        "emailAddress.address",
        "picture",
      ],
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
