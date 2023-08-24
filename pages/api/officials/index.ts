import { IOfficialsData } from "@/models/omsu-officials/officials-data";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<IOfficialsData | null>) {
  if (req.method !== "POST") {
    return res.status(400).json(null);
  }

  let API_URL = process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.base.db.Partner";

  const requestType = req.body["requestType"];
  const searchValue = req.body["searchValue"];
  const roleValue = req.body["roleValue"];
  const fileName = req.body["fileName"];

  let criteria: Array<any> = [
    {
      fieldName: "user.roles.name",
      operator: "=",
      value: roleValue,
    },
  ];

  if (requestType === "getAllData") {
    API_URL += "/search";
  }

  if (requestType === "export") {
    API_URL += "/export/";
  }

  if (requestType === "download") {
    API_URL += `/export/${fileName}`;
  }

  if (requestType === "search") {
    API_URL += "/search";

    criteria = [
      {
        fieldName: "user.roles.name",
        operator: "=",
        value: roleValue,
      },
      {
        operator: "or",
        criteria: [
          {
            fieldName: "lastName",
            operator: "like",
            value: `%${searchValue}%`,
          },
          {
            fieldName: "firstName",
            operator: "like",
            value: `%${searchValue}%`,
          },
          {
            fieldName: "middleName",
            operator: "like",
            value: `%${searchValue}%`,
          },
          {
            fieldName: "notaryPosition",
            operator: "like",
            value: `%${searchValue}%`,
          },
          {
            fieldName: "emailAddress.address",
            operator: "like",
            value: `%${searchValue}%`,
          },
          {
            fieldName: "simpleFullName",
            operator: "like",
            value: `%${searchValue}%`,
          },
          {
            fieldName: "notaryWorkOrder",
            operator: "like",
            value: `%${searchValue}%`,
          },
          {
            fieldName: "notaryCriminalRecord",
            operator: "like",
            value: `%${searchValue}%`,
          },
        ],
      },
    ];
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      offset: 0,
      limit: 100,
      field: [
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
        operator: "and",
        criteria: criteria,
      },
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}

// const fieldsToSearch = [
//   {
//     "fieldName": "user.roles.name", // Виды должностных лиц (роль пользователя)
//     "operator": "=",
//     "value": "OMSU official" // Должностные лица органов местного самоуправления
//   },
//   {
//     "operator": "or",
//     "criteria": [
//       {
//         "fieldName": "lastName",
//         "operator": "like",
//         "value": `%${searchValue}%` // значение который пользователь ввел в поисковую строку
//       },
//       {
//         "fieldName": "firstName",
//         "operator": "like",
//         "value": `%${searchValue}%` // значение который пользователь ввел в поисковую строку
//       },
//       {
//         "fieldName": "middleName",
//         "operator": "like",
//         "value": `%${searchValue}%` // значение который пользователь ввел в поисковую строку
//       },
//       {
//         "fieldName": "notaryPosition",
//         "operator": "like",
//         "value": `%${searchValue}%` // значение который пользователь ввел в поисковую строку
//       },
//       {
//         "fieldName": "emailAddress.address",
//         "operator": "like",
//         "value": `%${searchValue}%` // значение который пользователь ввел в поисковую строку
//       },
//       {
//         "fieldName": "simpleFullName",
//         "operator": "like",
//         "value": `%${searchValue}%` // значение который пользователь ввел в поисковую строку
//       },
//       {
//         "fieldName": "notaryWorkOrder",
//         "operator": "like",
//         "value": `%${searchValue}%` // значение который пользователь ввел в поисковую строку
//       },
//       {
//         "fieldName": "notaryCriminalRecord",
//         "operator": "like",
//         "value": `%${searchValue}%` // значение который пользователь ввел в поисковую строку
//       }
//     ]
//   }
// ];

// criteria = fieldsToSearch;
