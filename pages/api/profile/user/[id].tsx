import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "POST" || id == null) {
    return res.status(400).json(null);
  }

  const role = req.body["userRole"];
  let relatedFields;

  if (role === "notary") {
    relatedFields = {
      partner: ["emailAddress.address", "mobilePhone", "firstName", "lastName", "middleName"],
      activeCompany: [
        "latitude",
        "longitude",
        "typeOfNotary",
        "licenseNo",
        "licenseTermFrom",
        "licenseTermUntil",
        "licenseStatus",
        "roundClock",
        "workingDay",
        "notaryDistrict.name",
        "address.region.name",
        "address.district.name",
        "address.city.name",
        "address.addressL4",
        "address.addressL3",
        "address.addressL2",
      ],
    };
  } else if (role === "declarant") {
    relatedFields = {
      partner: [
        "emailAddress.address",
        "mobilePhone",
        "firstName",
        "lastName",
        "middleName",
        "mainAddress.region.name",
        "mainAddress.district.name",
        "mainAddress.city.name",
        "mainAddress.addressL4",
        "mainAddress.addressL3",
        "mainAddress.addressL2",
      ],
    };
  }

  const response = await fetch(process.env.BACKEND_API_URL + `/ws/rest/com.axelor.auth.db.User/${id}/fetch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      fields: ["name", "code"],
      related: relatedFields,
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
