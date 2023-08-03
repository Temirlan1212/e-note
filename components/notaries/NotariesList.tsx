import { FC } from "react";

import { Box, CircularProgress, Grid } from "@mui/material";

import NotariesCard from "./NotariesCard";
import { INotary, INotaryData } from "@/models/notaries/notary";
import Link from "next/link";
import Pagination from "../ui/Pagination";

interface INotaryListProps {
  handlePageChange: (val: any) => void;
  loading: boolean;
  data: INotaryData | null;
  appQueryParams: any;
}

const NotariesList: FC<INotaryListProps> = ({ loading, data, appQueryParams, handlePageChange }) => {
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
            {data?.data?.map((notary: INotary) => (
              <Link
                href={`/notaries/${encodeURIComponent(notary?.id)}`}
                style={{ textDecoration: "none" }}
                key={notary?.id}
              >
                <Grid item key={notary?.id} xs={12} sm={12} md={3}>
                  <NotariesCard
                    fullName={notary["partner.simpleFullName"]}
                    image={notary["logo.fileName"]}
                    rating={notary["partner.rating"]}
                    region={notary["address.region"]?.name}
                    area={notary["address.district"]?.name}
                    location={notary["address.city"]?.fullName}
                  />
                </Grid>
              </Link>
            ))}
          </Grid>
          {data?.data && (
            <Pagination
              sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
              currentPage={appQueryParams?.page}
              totalPages={data?.total ? Math.ceil(data.total / appQueryParams.pageSize) : 1}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default NotariesList;
