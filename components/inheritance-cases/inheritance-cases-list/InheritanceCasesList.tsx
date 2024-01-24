import { useTranslations } from "next-intl";
import Pagination from "@/components/ui/Pagination";
import InheritanceCasesTable from "./inheritance-cases-table/InheritanceCasesTable";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { Box, Typography } from "@mui/material";
import FilterContent from "./filter-content/FilterContent";
import { useFetchListParams } from "@/contexts/fetch-list-params";
import { InheritanceCasesFilterValuesProps } from "@/models/inheritance-cases";

export default function InheritanceCasesList() {
  const t = useTranslations();
  const { updateParams, params } = useFetchListParams<InheritanceCasesFilterValuesProps>();

  const { data, loading } = useFetch<FetchResponseBody | null>("/api/inheritance-cases", "POST", {
    body: params,
  });

  const rows = Array.isArray(data?.data) ? data?.data ?? [] : [];
  const total = data?.total || 1;

  const calculateTotalPages = () => {
    return Math.ceil(Number(total) / params.pageSize);
  };

  return (
    <>
      <Typography typography="h4" color="primary">
        {t("Register of inheritance cases")}
      </Typography>

      <FilterContent />

      <InheritanceCasesTable loading={loading} rows={rows} />

      <Box alignSelf="center">
        <Pagination
          sx={{ display: "flex", justifyContent: "center" }}
          currentPage={params.page}
          onPageChange={(page) => updateParams("page", page)}
          totalPages={calculateTotalPages()}
        />
      </Box>
    </>
  );
}
