import { FC } from "react";
import { Box, CircularProgress, Grid } from "@mui/material";
import NotariesCard from "./NotariesCard";
import { INotary } from "@/models/notaries";
import Link from "next/link";
import Pagination from "../ui/Pagination";
import { INotariesQueryParams } from "./NotariesContent";
import { FetchResponseBody } from "@/hooks/useFetch";
import { useRouter } from "next/router";

interface INotaryListProps {
  handlePageChange: (val: any) => void;
  loading: boolean;
  data: FetchResponseBody | null;
  notariesQueryParams: INotariesQueryParams;
}

const NotariesList: FC<INotaryListProps> = ({ loading, data, notariesQueryParams, handlePageChange }) => {
  const { locale } = useRouter();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "50px", alignItems: "center" }}>
      {loading ? (
        <Box sx={{ display: "flex", height: "100vh", paddingTop: "200px" }}>
          <CircularProgress color="success" />
        </Box>
      ) : (
        <>
          <Grid
            sx={{
              justifyContent: "center",
              alignItems: "flex-start",
              flexDirection: {
                xs: "column",
                md: "row",
              },
              gridRowGap: {
                xs: "15px",
                md: 0,
              },
            }}
            container
          >
            {data?.data?.map((notary: INotary) => {
              const city = locale != "en" ? notary["$t:address.city.name"] : notary["address.city.name"];
              return (
                <Box width={{ xs: "100%", md: "initial" }} key={notary?.id}>
                  <Link
                    href={{
                      pathname: `/notaries/${encodeURIComponent(notary.id)}`,
                    }}
                    style={{ textDecoration: "none" }}
                  >
                    <Grid item key={notary?.id} xs={12} sm={12} md={3}>
                      <NotariesCard
                        id={notary?.id}
                        userId={notary["partner.linkedUser.id"]}
                        fullName={notary["partner.fullName"]}
                        region={notary["address.region"]}
                        area={notary["address.district"]}
                        city={city}
                        licenseTermUntil={notary?.licenseTermUntil}
                      />
                    </Grid>
                  </Link>
                </Box>
              );
            })}
          </Grid>
          {data?.data && (
            <Pagination
              sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
              currentPage={notariesQueryParams?.page}
              totalPages={data?.total ? Math.ceil(data.total / notariesQueryParams.pageSize) : 1}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default NotariesList;
