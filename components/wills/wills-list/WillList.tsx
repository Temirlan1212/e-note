import { useTranslations } from "next-intl";
import Pagination from "@/components/ui/Pagination";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { Box, Typography } from "@mui/material";
import FilterContent from "./filter-content/FilterContent";
import { useFetchListParams } from "@/contexts/fetch-list-params";
import { InheritanceCasesFilterValuesProps } from "@/models/inheritance-cases";
import WillsTable from "./wills-table/WillsTable";
import { useRouter } from "next/router";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Button from "@/components/ui/Button";

export default function WillsList() {
  const t = useTranslations();
  const router = useRouter();
  const { updateParams, params } = useFetchListParams<InheritanceCasesFilterValuesProps>();

  const { data, loading } = useFetch<FetchResponseBody | null>("/api/wills", "POST", {
    body: params,
  });

  const rows = Array.isArray(data?.data) ? data?.data ?? [] : [];
  const total = data?.total || 1;

  const calculateTotalPages = () => {
    return Math.ceil(Number(total) / params.pageSize);
  };

  const handleCreate = async () => {
    router.push("/applications/create");
  };

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="20px">
        <Typography variant="h4" color="primary">
          {t("Register of wills")}
        </Typography>
        <Box>
          <Button onClick={handleCreate} sx={{ py: "10px", px: "20px" }} component="label" startIcon={<PostAddIcon />}>
            {t("Create")}
          </Button>
        </Box>
      </Box>

      <FilterContent />

      <WillsTable loading={loading} rows={rows} />

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
