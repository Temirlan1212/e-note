import { GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";
import { useLocale } from "next-intl";

export const ActualResidenceAddress = (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
  const locale = useLocale();
  const nameKey = locale !== "en" ? "$t:name" : "name";
  const region = params.row?.["requester.mainAddress.region"]?.[nameKey] || "";
  const district = params.row?.["requester.mainAddress.district"]?.[nameKey] || "";
  const city = params.row?.["requester.mainAddress.city.name"] || "";
  const addressL4 = params.row?.["requester.mainAddress.addressL4"] || "";
  const addressL3 = params.row?.["requester.mainAddress.addressL3"] || "";
  const addressL2 = params.row?.["requester.mainAddress.addressL2"] || "";
  const format = (text: string | null) => {
    if (!text) return "";
    return `${text} /`;
  };

  return `${format(region)} ${format(district)} ${format(city)} ${format(addressL4)} ${format(addressL3)} ${addressL2}`;
};
