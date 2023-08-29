import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const roleValue = req.body["roleValue"];

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.base.db.Partner/export/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      offset: 0,
      limit: 6,
      fields: [
        "lastName",
        "firstName",
        "middleName",
        "notaryPosition",
        "birthDate",
        "mobilePhone",
        "emailAddress.address",
        "simpleFullName",
        "notaryWorkOrder",
        "notaryCriminalRecord",
      ],
      data: {
        criteria: [
          {
            fieldName: "user.roles.name",
            operator: "=",
            value: roleValue,
          },
        ],
      },
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
