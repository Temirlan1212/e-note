import type { NextApiRequest, NextApiResponse } from "next";

import { INotaryData } from "@/models/notaries";
import { Criteria, INotaryFilterData } from "@/components/notaries/NotariesContent";

export default async function handler(req: NextApiRequest, res: NextApiResponse<INotaryData | null>) {
  if (req.method !== "POST" && req.body == null) {
    return res.status(400).json(null);
  }

  const pageSize = Number.isInteger(Number(req.body["pageSize"])) ? Number(req.body["pageSize"]) : 8;
  const page = Number.isInteger(Number(req.body["page"])) ? (Number(req.body["page"]) - 1) * pageSize : 0;

  const criteria: Criteria[] = [];
  let data: any = {};

  const radioValue = req.body["radioValue"];
  const requestType = req.body["requestType"];
  const searchValue = req.body["searchValue"];
  const requestData = req.body["requestData"];
  const sortBy = req.body["sortBy"];

  const buildFilterCriteria = (filterData: INotaryFilterData) => {
    if (filterData.city !== null) {
      criteria.push({
        fieldName: "address.city.id",
        operator: "=",
        value: filterData.city,
      });
    }

    if (filterData.district !== null) {
      criteria.push({
        fieldName: "address.district.id",
        operator: "=",
        value: filterData.district,
      });
    }

    if (filterData.notaryDistrict !== null) {
      criteria.push({
        fieldName: "notaryDistrict.id",
        operator: "=",
        value: filterData.notaryDistrict,
      });
    }

    if (filterData.region !== null) {
      criteria.push({
        fieldName: "address.region.id",
        operator: "=",
        value: filterData.region,
      });
    }

    if (filterData.workDays !== null) {
      criteria.push({
        fieldName: "workingDay.weekDayNumber",
        operator: "in",
        value: filterData.workDays.split(",").map(Number),
      });
    }

    if (filterData.typeOfNotary !== null) {
      criteria.push({
        fieldName: "typeOfNotary",
        operator: "=",
        value: filterData.typeOfNotary,
      });
    }

    return criteria;
  };

  const radioChecked = () => {
    if (radioValue === "roundClock") {
      return [
        {
          fieldName: "roundClock",
          operator: "=",
          value: true,
        },
        {
          fieldName: "checkOut",
          operator: "=",
          value: false,
        },
      ];
    } else if (radioValue === "checkOut") {
      return [
        {
          fieldName: "roundClock",
          operator: "=",
          value: false,
        },
        {
          fieldName: "checkOut",
          operator: "=",
          value: true,
        },
      ];
    } else {
      return [];
    }
  };

  if (requestType === "keywordSearch") {
    data = {
      operator: "and",
      criteria: [
        {
          fieldName: "name",
          operator: "like",
          value: searchValue,
        },
      ],
    };
  }

  if (requestType === "filterSearch") {
    const newArr = buildFilterCriteria(requestData);
    const criteriaArr = newArr.concat(radioChecked());
    data = {
      criteria: criteriaArr,
      operator: "and",
    };
  }

  if (requestType === "sortBy") {
    data = {
      criteria: criteria ?? [],
      sortBy: sortBy ?? [],
    };
  }

  const response = await fetch(process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.base.db.Company/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: req.headers["server-cookie"]?.toString() ?? "",
    },
    body: JSON.stringify({
      offset: page,
      limit: pageSize,
      fields: [
        "partner.simpleFullName",
        "partner.rating",
        "logo.fileName",
        "address.region",
        "address.district",
        "address.city",
      ],
      data: data,
      ...req.body,
    }),
  });

  if (!response.ok) {
    return res.status(response.status).json(null);
  }

  const responseData = await response.json();

  return res.status(200).json(responseData);
}
