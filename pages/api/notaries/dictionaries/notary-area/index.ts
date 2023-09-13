import type { NextApiRequest, NextApiResponse } from "next";

import { INotarySelections } from "@/models/notaries";

export default async function handler(req: NextApiRequest, res: NextApiResponse<INotarySelections | null>) {
  if (req.method !== "POST" && req.body == null) {
    return res.status(400).json(null);
  }

  const regionId = req.body["regionId"];
  const cityId = req.body["cityId"];
  const districtId = req.body["districtId"];

  const data: any =
    regionId && cityId && districtId
      ? {
          criteria: [
            {
              operator: "and",
              criteria: [
                {
                  fieldName: "district.region.id",
                  operator: "=",
                  value: regionId,
                },
                {
                  fieldName: "district.id",
                  operator: "=",
                  value: districtId,
                },
                {
                  fieldName: "city.id",
                  operator: "=",
                  value: cityId,
                },
              ],
            },
          ],
        }
      : {};

  const response = await fetch(
    process.env.BACKEND_XAPI_URL + "/search/axelor-erp/com.axelor.apps.notary.db.NotaryDistrict",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: ["name"],
        data: data,
      }),
    }
  );

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
