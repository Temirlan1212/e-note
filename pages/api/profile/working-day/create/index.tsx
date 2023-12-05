import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT" || req.body == null) {
    return res.status(400).json(null);
  }

  const { startWorkingDay, endWorkingDay, notaryId, weekDayNumber } = req.body.body;

  const response = await fetch(process.env.BACKEND_API_URL + `/ws/rest/com.axelor.apps.notary.db.WorkingDay`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      data: {
        startDate: startWorkingDay,
        endDate: endWorkingDay,
        weekDayNumber: weekDayNumber,
        notary: {
          id: notaryId,
        },
      },
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
