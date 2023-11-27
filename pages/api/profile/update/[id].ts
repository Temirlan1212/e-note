import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "POST" || req.body == null) {
    return res.status(400).json(null);
  }

  const buildRequestBody = () => {
    if (req.body.body && req.body.body.submitData) {
      const { submitData, userData, imageBase64, userRole } = req.body.body;

      const requestBody: any = {
        id: userData?.data?.[0]?.id,
        version: userData?.data?.[0]?.version,
        image: imageBase64,
        partner: {
          id: userData?.data?.[0]?.partner?.id,
          version: userData?.data?.[0]?.partner?.version,
          firstName: submitData?.partner?.firstName,
          lastName: submitData?.partner?.lastName,
          middleName: submitData?.partner?.middleName,
          mobilePhone: submitData?.partner?.mobilePhone,
          emailAddress: {
            id: userData?.data?.[0]?.partner?.emailAddress?.id,
            version: userData?.data?.[0]?.partner?.emailAddress?.$version,
            address: submitData?.partner?.emailAddress.address,
          },
        },
      };

      if (userRole === "notary") {
        requestBody.activeCompany = {
          id: userData?.data?.[0]?.activeCompany?.id,
          version: userData?.data?.[0]?.activeCompany?.version,
          longitude: submitData?.activeCompany?.longitude,
          latitude: submitData?.activeCompany?.latitude,
          address: {
            id: userData?.data?.[0]?.activeCompany?.address?.id,
            version: userData?.data?.[0]?.activeCompany?.address?.$version,
            region: {
              id: submitData?.activeCompany?.address?.region?.id,
            },
            city: {
              id: submitData?.activeCompany?.address?.city?.id,
            },
            district: {
              id: submitData?.activeCompany?.address?.district?.id,
            },
            addressL4: submitData?.activeCompany?.address?.addressL4,
            addressL3: submitData?.activeCompany?.address?.addressL3,
            addressL2: submitData?.activeCompany?.address?.addressL2,
          },
          notaryDistrict: {
            id: submitData?.activeCompany?.notaryDistrict?.id,
          },
        };
      }
      return requestBody;
    }
  };

  const response = await fetch(process.env.BACKEND_API_URL + `/ws/rest/com.axelor.auth.db.User/${id}`, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      data: buildRequestBody() ? buildRequestBody() : { ...req.body },
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
