import React, { useState } from "react";
import ShowRemind from "./ShowRemind";
import Button from "@/components/ui/Button";
import { TextField, Typography, InputAdornment, Box, InputLabel } from "@mui/material";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import NothingFound from "./NothingFound";

export default function CheckByID({ showRemind, closeRemind }) {
  const [textValue, setTextValue] = useState("");
  const [documentData, setDocumentData] = useState([]);
  const [documentFound, setDocumentFound] = useState(false);
  const t = useTranslations();

  const documentPadding = "0px 16px 24px 16px";
  const handleButtonClick = (e) => {
    e.preventDefault();
    console.log(textValue);
    fetch(`https://jsonplaceholder.typicode.com/users/${textValue}`)
      .then((response) => {
        if (!response.ok) {
          setDocumentFound(false);
          return {};
        }
        return response.json();
      })
      .then((json) => {
        console.log(json);
        if (Object.keys(json).length === 0) {
          setDocumentFound(false);
        } else {
          setDocumentData(json);
          setDocumentFound(true);
        }
      })
      .catch((error) => {
        console.error("Error occurred during fetch:", error);
        setDocumentFound(false);
      });
  };

  const handleTextChange = (e) => {
    setTextValue(e.target.value);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "30px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: "15px",
          }}
        >
          <InputLabel htmlFor="search-field" sx={{ whiteSpace: "normal" }}>
            {t("Enter a unique number (ID) of the document to search:")}
          </InputLabel>
          <TextField
            id="search-field"
            value={textValue}
            onChange={handleTextChange}
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <Button href="/" variant="contained" color="success" onClick={handleButtonClick}>
                    <Box component="img" alt="#" src="/icons/searchLoupe.svg" height="100%" />
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        {!documentFound && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "50px",
            }}
          >
            {showRemind && (
              <ShowRemind closeRemind={closeRemind} documentFound={documentFound} iconUrl="/icons/close.svg" />
            )}
            <NothingFound />
          </Box>
        )}
        {documentFound && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: { xs: "30px 10px", md: "30px 20px" },
              width: "100%",
              gap: "30px",
              backgroundColor: "#FFF",
              boxShadow: "0px 10px 40px 0px #DCDCDC",
            }}
          >
            <ShowRemind
              documentFound={documentFound}
              remindTitle="Document Found"
              remindText="Below you can see information about the notarial document"
              iconUrl="/icons/check-mark.svg"
            />
            <Box
              sx={{
                display: "inherit",
                flexDirection: "inherit",
                border: "1px solid #CDCDCD",
                padding: "16px 0",
                gap: "24px",
              }}
            >
              <Box
                sx={{
                  padding: documentPadding,
                }}
              >
                <Typography fontWeight={600}>{t("Name")}</Typography>
                <Typography fontWeight={400}>{t(`${documentData.name}`)}</Typography>
              </Box>
              <Box
                sx={{
                  padding: documentPadding,
                }}
              >
                <Typography fontWeight={600}>{t("Type of notarial action")}</Typography>
                <Typography fontWeight={400}>{t(`${documentData.name}`)}</Typography>
              </Box>
              <Box
                sx={{
                  padding: documentPadding,
                }}
              >
                <Typography fontWeight={600}>{t("Status")}</Typography>
                <Typography fontWeight={400}>{t(`${documentData.id}`)}</Typography>
              </Box>
              <Box
                sx={{
                  padding: documentPadding,
                }}
              >
                <Typography fontWeight={600}>{t("Date of action")}</Typography>
                <Typography fontWeight={400}>{t(`${documentData.phone}`)}</Typography>
              </Box>
              <Box
                sx={{
                  padding: documentPadding,
                }}
              >
                <Typography fontWeight={600}>{t("Full name of the notary")}</Typography>
                <Typography fontWeight={400}>{t(`${documentData.name}`)}</Typography>
              </Box>
              <Box
                sx={{
                  padding: documentPadding,
                }}
              >
                <Typography fontWeight={600}>{t("Unique registry number")}</Typography>
                <Typography fontWeight={400}>{t(`${documentData.name}`)}</Typography>
              </Box>
              <Box
                sx={{
                  padding: documentPadding,
                }}
              >
                <Typography fontWeight={600}>{t("Parties")}</Typography>
                <Typography fontWeight={400}>{t(`${documentData.name}`)}</Typography>
              </Box>
              <Box
                sx={{
                  padding: documentPadding,
                  display: "grid",
                  gap: "8px",
                }}
              >
                <Typography fontWeight={600}>{t("Parties")}</Typography>
                <Typography fontWeight={500}>{t("Participant-1:")}</Typography>
                <Typography fontWeight={400}>{t(`${documentData.name}`)}</Typography>
                <Typography fontWeight={400}>{t(`${documentData.zipcode}`)}</Typography>
                <Typography fontWeight={400}>{t(`${documentData.email}`)}</Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
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
