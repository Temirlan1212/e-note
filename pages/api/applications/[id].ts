import type { NextApiRequest, NextApiResponse } from "next";

const fields: string[] = [
  "id",
  "version",
  "createdBy",
  "createdOn",
  "notaryUniqNumber",
  "notarySignatureStatus",
  "company",
  "object",
  "objectType",
  "notarialAction",
  "typeNotarialAction",
  "action",
  "product",
  "creationDate",
  "statusSelect",
];

const related: Record<string, typeof fields> = {
  requester: [
    "partnerTypeSelect",
    "foreigner",
    "lastName",
    "name",
    "middleName",
    "personalNumber",
    "birthDate",
    "citizenship",
    "identityDocument",
    "passportSeries",
    "passportNumber",
    "authority",
    "authorityNumber",
    "dateOfIssue",
    "mobilePhone",
    "emailAddress.version",
    "emailAddress.address",
    "mainAddress.version",
    "mainAddress.region",
    "mainAddress.district",
    "mainAddress.city",
    "mainAddress.addressL4",
    "mainAddress.addressL3",
    "mainAddress.addressL2",
    "actualResidenceAddress.version",
    "actualResidenceAddress.region",
    "actualResidenceAddress.district",
    "actualResidenceAddress.city",
    "actualResidenceAddress.addressL4",
    "actualResidenceAddress.addressL3",
    "actualResidenceAddress.addressL2",
    "nameOfCompanyOfficial",
    "nameOfCompanyGov",
    "representativesName",
    "notaryRegistrationNumber",
    "notaryOKPONumber",
    "notaryPhysicalParticipantsQty",
    "notaryLegalParticipantsQty",
    "notaryTotalParticipantsQty",
  ],
  members: [
    "partnerTypeSelect",
    "foreigner",
    "lastName",
    "name",
    "middleName",
    "personalNumber",
    "birthDate",
    "citizenship",
    "identityDocument",
    "passportSeries",
    "passportNumber",
    "authority",
    "authorityNumber",
    "dateOfIssue",
    "mobilePhone",
    "emailAddress.version",
    "emailAddress.address",
    "mainAddress.version",
    "mainAddress.region",
    "mainAddress.district",
    "mainAddress.city",
    "mainAddress.addressL4",
    "mainAddress.addressL3",
    "mainAddress.addressL2",
    "actualResidenceAddress.version",
    "actualResidenceAddress.region",
    "actualResidenceAddress.district",
    "actualResidenceAddress.city",
    "actualResidenceAddress.addressL4",
    "actualResidenceAddress.addressL3",
    "actualResidenceAddress.addressL2",
    "nameOfCompanyOfficial",
    "nameOfCompanyGov",
    "representativesName",
    "notaryRegistrationNumber",
    "notaryOKPONumber",
    "notaryPhysicalParticipantsQty",
    "notaryLegalParticipantsQty",
    "notaryTotalParticipantsQty",
  ],
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "POST" || id == null) {
    return res.status(400).json(null);
  }

  let filterFields: typeof fields | null = null;
  if (req.body.fields != null) {
    filterFields = req.body.fields;
  }

  let filterRelated: typeof related | null = null;
  if (req.body.related != null) {
    filterRelated = req.body.related;
  }

  const response = await fetch(process.env.BACKEND_API_URL + `/ws/rest/com.axelor.apps.sale.db.SaleOrder/${id}/fetch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      fields: filterFields ?? fields,
      related: filterRelated ?? related,
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
