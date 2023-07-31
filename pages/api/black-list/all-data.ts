import { ISubjectData } from "@/models/black-list/all-data";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ISubjectData | null>) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.base.db.Blocking/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      offset: 0,
      limit: 10,
      fields: [
        "partner.personalNumber",
        "partner.birthDate",
        "partner.fullName",
        "createdOn",
        "createdBy.fullName",
        "blockingReason.name",
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

// const requestBody = {
//     fields: ["partner.personalNumber", "partner.birthDate", "partner.fullName", "createdOn", "createdBy.fullName", "blockingReason.name"],
//     data: {
//         criteria: [
//             {
//                 fieldName: "blockingReason.name",
//                 operator: "like",
//                 value: "%jo%",
//             },
//             {
//                 fieldName: "partner.personalNumber",
//                 operator: "like",
//                 value: "%223%",
//             },
//             {
//                 fieldName: "partner.fullName",
//                 operator: "like",
//                 value: "%po%",
//             },
//         ],
//     },
// }
