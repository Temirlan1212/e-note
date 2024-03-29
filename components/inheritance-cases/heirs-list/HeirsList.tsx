import { useTranslations } from "next-intl";
import Pagination from "@/components/ui/Pagination";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { Box, Typography } from "@mui/material";
import { useFetchListParams } from "@/contexts/fetch-list-params";
import { InheritanceCasesFilterValuesProps } from "@/models/inheritance-cases";
import { useRouter } from "next/router";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Button from "@/components/ui/Button";
import HeirsTable from "./heirs-table/HeirsTable";
import FilterContent from "./filter-content/FilterContent";
import { ScrollHandler } from "@/components/ui/ScrollHandler";

export default function HeirsList({ parentRequestStatus }: { parentRequestStatus: "pending" | "finished" }) {
  const t = useTranslations();
  const router = useRouter();
  const { updateParams, params } = useFetchListParams<InheritanceCasesFilterValuesProps>();

  const { data, loading, status } = useFetch<FetchResponseBody | null>(`/api/heirs/${router.query?.id}`, "POST", {
    body: params,
  });

  const rows = Array.isArray(data?.data) ? data?.data ?? [] : [];
  const total = data?.total || 1;

  const calculateTotalPages = () => {
    return Math.ceil(Number(total) / params.pageSize);
  };

  const handleCreate = async () => {
    router.push({
      pathname: "/applications/create",
      query: { redirectUrl: router.asPath + "#hairs-list", saleOrderRef: router.query.id },
    });
  };

  return (
    <ScrollHandler start={status === "finished" && parentRequestStatus === "finished"} seconds={0}>
      <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="20px" id="hairs-list">
        <Typography variant="h4" color="primary">
          {t("List of heirs")}
        </Typography>
        <Box>
          <Button onClick={handleCreate} sx={{ py: "10px", px: "20px" }} component="label" startIcon={<PostAddIcon />}>
            {t("Create an heir")}
          </Button>
        </Box>
      </Box>

      <FilterContent />

      <HeirsTable loading={loading} rows={rows} />

      <Box alignSelf="center">
        <Pagination
          sx={{ display: "flex", justifyContent: "center" }}
          currentPage={params.page}
          onPageChange={(page) => updateParams("page", page)}
          totalPages={calculateTotalPages()}
        />
      </Box>
    </ScrollHandler>
  );
}
