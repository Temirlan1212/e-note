import { useTranslations } from "next-intl";
import Pagination from "@/components/ui/Pagination";
import InheritanceCasesTable from "./inheritance-cases-table/InheritanceCasesTable";
import { useFilterValues } from "./core/FilterValuesContext";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { Box, Typography } from "@mui/material";
import FilterContent from "./filter-content/FilterContent";

export default function InheritanceCasesList() {
  const t = useTranslations();
  const { updateQueryParams, queryParams } = useFilterValues();

  const { data, loading } = useFetch<FetchResponseBody | null>("/api/inheritance-cases", "POST", {
    body: queryParams,
  });

  const rows = Array.isArray(data?.data) ? data?.data ?? [] : [];
  const total = data?.total || 1;

  const calculateTotalPages = () => {
    return Math.ceil(Number(total) / queryParams.pageSize);
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
          currentPage={queryParams.page}
          onPageChange={(page) => updateQueryParams("page", page)}
          totalPages={calculateTotalPages()}
        />
      </Box>
    </>
  );
}
