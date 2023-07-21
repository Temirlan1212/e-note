import React, { useState } from "react";
import { Typography, Box, InputLabel } from "@mui/material";
import { useTranslations } from "next-intl";
import { SearchOutlined } from "@mui/icons-material";

import ShowRemind from "./ShowRemind";
import NothingFound from "./NothingFound";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function CheckByID({ showRemind, closeRemind }: { showRemind: Boolean; closeRemind: Function }) {
  const [textValue, setTextValue] = useState("");
  const [documentData, setDocumentData] = useState({});
  const [documentFound, setDocumentFound] = useState(false);
  const t = useTranslations();

  const documentPadding = "0px 16px 24px 16px";

  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (textValue.trim() === "") {
      setDocumentFound(false);
      return;
    }
    fetch(`https://jsonplaceholder.typicode.com/users/${textValue}`)
      .then((response) => {
        if (!response.ok) {
          setDocumentFound(false);
          return {};
        }
        return response.json();
      })
      .then((json) => {
        if (Object.keys(json).length === 0) {
          setDocumentFound(false);
        } else {
          setDocumentData(json);
          setDocumentFound(true);
        }
      })
      .catch((error) => {
        setDocumentFound(false);
      });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "30px" }}>
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: "15px" }}>
        <InputLabel htmlFor="search-field" sx={{ whiteSpace: "normal", color: "#687C9B" }}>
          {t("Enter a unique number (ID) of the document to search:")}
        </InputLabel>
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <Input
            id="search-field"
            value={textValue}
            placeholder={t("Search")}
            onChange={(e) => setTextValue(e.target.value)}
            fullWidth
          />
          <Button sx={{ width: "80px", height: "56px" }} type="submit" color="success" onClick={handleSearchClick}>
            <SearchOutlined />
          </Button>
        </Box>
      </Box>

      {documentFound ? (
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
            remindTitle={<Typography fontWeight={600}>{t("Document Found")}</Typography>}
            remindText={
              <Typography fontWeight={400}>{t("Below you can see information about the notarial document")}</Typography>
            }
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
            <Box sx={{ padding: documentPadding }}>
              <Typography fontWeight={600}>{t("Name")}</Typography>
              <Typography fontWeight={400}>{t(`${documentData.name}`)}</Typography>
            </Box>
            <Box sx={{ padding: documentPadding }}>
              <Typography fontWeight={600}>{t("Type of notarial action")}</Typography>
              <Typography fontWeight={400}>{t(`${documentData.name}`)}</Typography>
            </Box>
            <Box sx={{ padding: documentPadding }}>
              <Typography fontWeight={600}>{t("Status")}</Typography>
              <Typography fontWeight={400}>{t(`${documentData.id}`)}</Typography>
            </Box>
            <Box sx={{ padding: documentPadding }}>
              <Typography fontWeight={600}>{t("Date of action")}</Typography>
              <Typography fontWeight={400}>{t(`${documentData.phone}`)}</Typography>
            </Box>
            <Box sx={{ padding: documentPadding }}>
              <Typography fontWeight={600}>{t("Full name of the notary")}</Typography>
              <Typography fontWeight={400}>{t(`${documentData.name}`)}</Typography>
            </Box>
            <Box sx={{ padding: documentPadding }}>
              <Typography fontWeight={600}>{t("Unique registry number")}</Typography>
              <Typography fontWeight={400}>{t(`${documentData.name}`)}</Typography>
            </Box>
            <Box sx={{ padding: documentPadding }}>
              <Typography fontWeight={600}>{t("Parties")}</Typography>
              <Typography fontWeight={400}>{t(`${documentData.name}`)}</Typography>
            </Box>
            <Box sx={{ padding: documentPadding, display: "grid", gap: "8px" }}>
              <Typography fontWeight={600}>{t("Parties")}</Typography>
              <Typography fontWeight={500}>{t("Participant-1:")}</Typography>
              <Typography fontWeight={400}>{t(`${documentData.name}`)}</Typography>
              <Typography fontWeight={400}>{t(`${documentData.zipcode}`)}</Typography>
              <Typography fontWeight={400}>{t(`${documentData.email}`)}</Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "50px" }}>
          {showRemind && <ShowRemind closeRemind={closeRemind} documentFound={documentFound} />}
          <NothingFound />
        </Box>
      )}
    </Box>
  );
}
