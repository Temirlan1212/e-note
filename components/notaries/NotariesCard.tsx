import React, { FC, useState } from "react";
import { Avatar, Box, Card, CardContent, CardHeader, CircularProgress, Typography } from "@mui/material";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import Rating from "@/components/ui/Rating";
import { useRouter } from "next/router";
import { INotaryGeo } from "@/models/notaries";
import useFetch from "@/hooks/useFetch";
import { useTranslations } from "next-intl";
import useEffectOnce from "@/hooks/useEffectOnce";

interface INotaryProps {
  id?: number;
  fullName?: string;
  region?: INotaryGeo;
  area?: INotaryGeo;
  city?: string;
  userId?: number;
  licenseTermUntil?: string | null;
}

const NotariesCard: FC<INotaryProps> = ({ id, fullName, region, area, city, userId, licenseTermUntil }) => {
  const { locale } = useRouter();
  const t = useTranslations();

  const [base64Image, setBase64Image] = useState<string | null>(null);

  const { data: ratingData } = useFetch(id != null ? `/api/rating/${id}` : "", "GET");

  const { data: imageData, loading: imageLoading } = useFetch<Response>(
    userId != null ? "/api/notaries/download-image/" + userId : "",
    "POST",
    {
      returnResponse: true,
    }
  );

  const handleCheckLicenseDate = () => {
    if (licenseTermUntil) {
      const notaryLicenseTermUntil = new Date(licenseTermUntil);
      const currentDate = new Date();

      return notaryLicenseTermUntil > currentDate ? "License has expired or is invalid" : undefined;
    }
  };

  useEffectOnce(async () => {
    const base64String = await imageData?.text();
    if (base64String) {
      setBase64Image(base64String);
    }
  }, [imageData]);

  return (
    <Card
      sx={{
        width: { xs: "100%", md: "17.8rem" },
        boxShadow: {
          xs: "0px 1px 0px -1px rgba(0,0,0,0.2), 0px 1px 5px -1px rgba(0,0,0,0.14), 0px 0px 2px 0px rgba(0,0,0,0.2)",
          md: 0,
        },
        backgroundColor: "inherit",
        transition: "all .5s ease",
        "&:hover": { backgroundColor: "white", boxShadow: "0px 10px 20px 0px #cbcaca", cursor: "pointer" },
      }}
    >
      {imageLoading ? (
        <CircularProgress />
      ) : (
        <CardHeader
          sx={{
            display: "flex",
            flexDirection: { xs: "row", md: "column" },
            gap: { xs: "10px", md: 0 },
          }}
          avatar={
            <Avatar
              sizes="100"
              src={base64Image!}
              sx={{
                bgcolor: "success.main",
                width: { xs: "50px", md: "100px" },
                height: { xs: "50px", md: "100px" },
                marginBottom: { xs: 0, md: "20px" },
              }}
              aria-label="recipe"
            >
              <PermIdentityIcon
                sx={{
                  width: { xs: "25px", md: "50px" },
                  height: { xs: "25px", md: "50px" },
                }}
              />
            </Avatar>
          }
          title={fullName}
        />
      )}
      <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "start", md: "center" } }}>
        <Box sx={{ display: "flex" }} gap="8px">
          <Rating value={Number(ratingData?.data?.average) || 0} readOnly />
          {ratingData?.data?.count ? (
            <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
              {ratingData?.data?.average != null ? Number(ratingData?.data?.average).toFixed(1) : "0"}
            </Typography>
          ) : null}
          <Typography sx={{ color: "#BDBDBD", fontSize: "16px", fontWeight: 400 }}>
            {ratingData?.data?.count} {t("ratings")}
          </Typography>
        </Box>
        <Box sx={{ display: { xs: "none", md: "block" }, width: "100%", marginTop: "20px" }}>
          <Typography>
            {region ? (locale === "ru" || locale === "kg" ? region["$t:name"] : region.name) : ""}
          </Typography>
          <Typography>{area ? (locale === "ru" || locale === "kg" ? area["$t:name"] : area.name) : ""}</Typography>
          <Typography>{city}</Typography>
          <Typography fontSize="13px" fontWeight={500}>
            {t(handleCheckLicenseDate())}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotariesCard;
