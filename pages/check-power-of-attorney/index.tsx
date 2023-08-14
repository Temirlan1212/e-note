import React, { useState } from "react";
import Head from "next/head";
import { Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";

import Button from "../../components/ui/Button";
import CheckByID from "../../components/check-power-of-attorney/CheckByID";
import CheckByQR from "../../components/check-power-of-attorney/CheckByQR";

export default function index() {
  const [isVariantClicked, setIsVariantClicked] = useState(false);
  const [showRemind, setShowRemind] = useState(true);
  const [isCheckByID, setIsCheckByID] = useState(true);
  const [isCheckByQR, setIsCheckByQR] = useState(false);
  const t = useTranslations();

  const handleVariantClick = () => {
    setIsVariantClicked(!isVariantClicked);
    setIsCheckByID(!isCheckByID);
    setIsCheckByQR(!isCheckByQR);
    setShowRemind(true);
  };

  const closeRemind = () => {
    setShowRemind(false);
  };

  return (
    <>
      <Head>
        <title>{t("Power of Attorney verification")}</title>
      </Head>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: "0 20px 0 20px", sm: "0 124px 0 124px", md: "0 267px 0 267px" },
        }}
      >
        <Container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            marginTop: { xs: "40px", sm: "50px", md: "60px" },
            marginBottom: { xs: "59px", sm: "99px", md: "122px" },
            gap: "50px",
          }}
        >
          <Typography align="center" fontSize={{ xs: "24px", sm: "24px", md: "36px" }} fontWeight={600}>
            {t("Power of Attorney verification")}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Button
                variant={isVariantClicked ? "text" : "contained"}
                sx={{
                  boxShadow: isVariantClicked ? "" : "0px 10px 20px 0px #99DBAF",
                  background: isVariantClicked ? "#EFEFEF" : "",
                  padding: "10px 0",
                }}
                color={isVariantClicked ? "inherit" : "success"}
                onClick={handleVariantClick}
              >
                <Typography
                  color={isVariantClicked ? "black" : "default"}
                  fontSize={{ xs: "14px", md: "16px" }}
                  fontWeight={isVariantClicked ? 400 : 600}
                >
                  {t("By document ID")}
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant={!isVariantClicked ? "text" : "contained"}
                sx={{
                  boxShadow: !isVariantClicked ? "" : "0px 10px 20px 0px #99DBAF",
                  background: !isVariantClicked ? "#EFEFEF" : "",
                  padding: "10px 0",
                }}
                color={!isVariantClicked ? "inherit" : "success"}
                onClick={handleVariantClick}
              >
                <Typography
                  color={!isVariantClicked ? "black" : "default"}
                  fontSize={{ xs: "14px", md: "16px" }}
                  fontWeight={!isVariantClicked ? 400 : 600}
                >
                  {t("By QR code")}
                </Typography>
              </Button>
            </Grid>
          </Grid>
          {isCheckByID && <CheckByID closeRemind={closeRemind} showRemind={showRemind} />}
          {isCheckByQR && <CheckByQR />}
        </Container>
      </Container>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/check-power-of-attorney.json`)).default,
      },
    },
  };
}
