import { useTranslations } from "next-intl";
import Pagination from "@/components/ui/Pagination";
import InheritanceCasesTable from "./inheritance-cases-table/InheritanceCasesTable";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { Box, Typography } from "@mui/material";
import FilterContent from "./filter-content/FilterContent";
import { useFetchListParams } from "@/contexts/fetch-list-params";
import { InheritanceCasesFilterValuesProps } from "@/models/inheritance-cases";
import Button from "@/components/ui/Button";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { useRouter } from "next/router";

export default function InheritanceCasesList() {
  const t = useTranslations();
  const router = useRouter();
  const { updateParams, params } = useFetchListParams<InheritanceCasesFilterValuesProps>();

  const { data, loading } = useFetch<FetchResponseBody | null>("/api/inheritance-cases", "POST", {
    body: params,
  });

  const rows = Array.isArray(data?.data) ? data?.data ?? [] : [];
  const total = data?.total || 1;

  const calculateTotalPages = () => {
    return Math.ceil(Number(total) / params.pageSize);
  };

  const handleCreate = async () => {
    router.push("/inheritance-cases/create");
  };

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="20px">
        <Typography variant="h4" color="primary">
          {t("Register of inheritance cases")}
        </Typography>
        <Box>
          <Button onClick={handleCreate} sx={{ py: "10px", px: "20px" }} component="label" startIcon={<PostAddIcon />}>
            {t("Create")}
          </Button>
        </Box>
      </Box>

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
