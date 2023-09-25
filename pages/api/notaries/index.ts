import type { NextApiRequest, NextApiResponse } from "next";

import { INotaryData, INotaryFilterData } from "@/models/notaries";

interface Data {
  operator?: string;
  sortBy?: string[] | null;
  criteria?: Criteria[];
}

interface Criteria {
  value: any;
  fieldName: string;
  operator: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<INotaryData | null>) {
  if (req.method !== "POST" && req.body == null) {
    return res.status(400).json(null);
  }
  let data: Data = {};

  const pageSize = Number.isInteger(Number(req.body["pageSize"])) ? Number(req.body["pageSize"]) : 8;
  const page = Number.isInteger(Number(req.body["page"])) ? (Number(req.body["page"]) - 1) * pageSize : 0;

  const radioValue = req.body["radioValue"];
  const searchValue = req.body["searchValue"];
  const filterData = req.body["filterData"];
  const sortBy = req.body["sortBy"];

  const buildFilterCriteria = (filterData: INotaryFilterData) => {
    const criteria: Criteria[] = [];
    if (filterData != null) {
      const fieldsMap = {
        city: "address.city.id",
        district: "address.district.id",
        notaryDistrict: "notaryDistrict.id",
        region: "address.region.id",
        workingDay: "workingDay.weekDayNumber",
        typeOfNotary: "typeOfNotary",
      };

      for (const field in fieldsMap) {
        const key = field as keyof typeof fieldsMap;
        if (filterData[key] !== null) {
          criteria.push({
            fieldName: fieldsMap[key],
            operator: "=",
            value: filterData[key],
          });
        }
      }

      if (filterData.workingDay !== null) {
        criteria.push({
          fieldName: "workingDay.weekDayNumber",
          operator: "in",
          value: filterData.workingDay.split(",").map(Number),
        });
      }
    }
    return criteria;
  };

  const radioChecked = () => {
    if (radioValue === "roundClock") {
      return [
        { fieldName: "roundClock", operator: "=", value: true },
        { fieldName: "checkOut", operator: "=", value: false },
      ];
    } else if (radioValue === "checkOut") {
      return [
        { fieldName: "roundClock", operator: "=", value: false },
        { fieldName: "checkOut", operator: "=", value: true },
      ];
    } else {
      return [];
    }
  };

  const response = await fetch(
    process.env.BACKEND_OPEN_API_URL + "/search/axelor-erp/com.axelor.apps.base.db.Company",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        offset: page,
        limit: pageSize,
        sortBy: sortBy ?? [],
        fields: [
          "partner.simpleFullName",
          "partner.rating",
          "logo.fileName",
          "address.region",
          "address.district",
          "address.city",
          "name",
        ],
        data: {
          ...data,
          operator: "and",
          criteria: [
            { criteria: buildFilterCriteria(filterData).concat(radioChecked()), operator: "and" },
            {
              fieldName: "name",
              operator: "like",
              value: searchValue ?? "",
            },
          ],
        },
      }),
    }
  );

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
