import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "POST" || req.body == null) {
    return res.status(400).json(null);
  }

  const { startWorkingDay, endWorkingDay, version, weekDayNumber } = req.body.body;

  const response = await fetch(process.env.BACKEND_API_URL + `/ws/rest/com.axelor.apps.notary.db.WorkingDay/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      data: {
        id: id,
        version: version,
        weekDayNumber: weekDayNumber,
        startDate: startWorkingDay,
        endDate: endWorkingDay,
      },
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
