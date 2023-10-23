import type { NextApiRequest, NextApiResponse } from "next";

const addCriteria = (
  criteria: Record<string, string | number>[],
  fieldName: string,
  id: string,
  operator: string = "="
) => {
  const parsedId = parseInt(id);
  criteria.push({
    fieldName,
    operator,
    value: Number.isNaN(parsedId) ? 0 : parsedId,
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { notaryDistrictId, regionId, districtId, cityId } = req.query;

  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  const criteria: Record<string, string | number>[] = [];
  const criteriaOptions = {
    "notaryDistrict.id": notaryDistrictId,
    "address.region.id": regionId,
    "address.district.id": districtId,
    "address.city.id": cityId,
  };

  Object.entries(criteriaOptions).map((item) => {
    if (item[1] !== "" && typeof item[1] === "string") {
      addCriteria(criteria, item[0], item[1] as string);
    }
  });

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.base.db.Company/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      fields: ["id", "version", "partner.fullName", "code", "notaryDistrict.id"],
      data: {
        operator: "and",
        criteria,
      },
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
