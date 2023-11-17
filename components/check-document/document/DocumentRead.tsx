import React, { FC } from "react";
import { useLocale, useTranslations } from "next-intl";
import { format } from "date-fns";

import { Box, CircularProgress, List, ListItem, Typography } from "@mui/material";
import { IActionType } from "@/models/action-type";
import { useTheme } from "@mui/material/styles";

import useFetch from "@/hooks/useFetch";
import { IApplication } from "@/models/application";
import { useRouter } from "next/router";

interface IDocumentReadProps {
  data: IApplication;
  loading: boolean;
}

const DocumentRead: FC<IDocumentReadProps> = ({ data, loading }) => {
  const theme = useTheme();
  const { locale } = useRouter();
  const t = useTranslations();

  const { data: statusData, loading: statusDataLoading } = useFetch(
    "/api/check-document/dictionaries/reliability-status",
    "GET"
  );
  const { data: actionTypeData, loading: actionTypeDataLoading } = useFetch(
    "/api/check-document/dictionaries/action-type",
    "GET"
  );
  const { data: signatureStatusData, loading: signatureStatusDataLoading } = useFetch(
    "/api/check-document/dictionaries/notary-signature-status",
    "GET"
  );

  const translatedStatusTitle = (data: Record<string, any>[], value?: number) => {
    const matchedStatus = data?.find((item) => item.value == value);
    const translatedTitle = matchedStatus?.[("title_" + locale) as keyof IActionType];
    return !!translatedTitle ? translatedTitle : matchedStatus?.["title" as keyof IActionType] ?? "";
  };

  const titles = [
    { title: "Name", value: locale !== "en" ? data?.product?.["$t:name"] || data?.product?.name : data?.product?.name },
    { title: "Type of notarial action", value: translatedStatusTitle(actionTypeData?.data, data?.typeNotarialAction) },
    { title: "Status", value: translatedStatusTitle(statusData?.data, data?.statusSelect) },
    { title: "Signature status", value: translatedStatusTitle(signatureStatusData?.data, data?.notarySignatureStatus) },
    {
      title: "Date of action",
      value: data?.creationDate ? format(new Date(data?.creationDate!), "dd.MM.yyyy HH:mm:ss") : "",
    },
    { title: "Full name of the notary", value: data?.company?.partner?.fullName },
    { title: "Unique registry number", value: data?.notaryUniqNumber ?? t("not signed") },
  ];

  if (data?.notaryCancelledDate) {
    titles.push(
      { title: "Cancel reason str", value: data?.cancelReasonStr },
      {
        title: "Cancel date",
        value: format(new Date(data?.notaryCancelledDate!), "dd.MM.yyyy HH:mm:ss"),
      }
    );
  }

  const members = data?.requester?.concat(data.members!);

  return (
    <>
      {!loading && !statusDataLoading && !actionTypeDataLoading && !signatureStatusDataLoading ? (
        <Box
          sx={{
            border: "1px solid #CDCDCD",
            padding: "25px 15px",
            display: "flex",
            gap: "25px",
          }}
        >
          <List
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "100%",
            }}
          >
            {titles.map((el, idx) => {
              return (
                <ListItem
                  key={idx}
                  sx={{
                    gap: "10px",
                    display: "flex",
                    [theme.breakpoints.down("sm")]: {
                      flexDirection: "column",
                    },
                    alignItems: "start",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: "600",
                      width: "100%",
                      minWidth: "260px",
                      maxWidth: { md: "280px", xs: "260px" },
                      [theme.breakpoints.down("sm")]: {
                        maxWidth: "unset",
                      },
                      wordBreak: "break-word",
                    }}
                  >
                    {t(el.title)}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#687C9B",
                      wordBreak: "break-all",
                    }}
                  >
                    {el.value != null && el.value !== "" ? el.value : t("absent")}
                  </Typography>
                </ListItem>
              );
            })}
            <ListItem
              sx={{
                gap: "10px",
                display: "flex",
                [theme.breakpoints.down("sm")]: {
                  flexDirection: "column",
                },
                alignItems: "start",
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "600",
                  width: "100%",
                  minWidth: "260px",
                  maxWidth: { md: "280px", xs: "260px" },
                  [theme.breakpoints.down("sm")]: {
                    maxWidth: "unset",
                  },
                  wordBreak: "break-word",
                }}
              >
                {t("Sides")}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {members?.map((member, idx) => (
                  <Box key={idx}>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {t("Participant")}-{idx + 1}:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#687C9B",
                      }}
                    >
                      {member.lastName} {member.name} {member.middleName}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#687C9B",
                      }}
                    >
                      {member.mainAddress.fullName}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </ListItem>
          </List>
        </Box>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress color="success" />
        </Box>
      )}
    </>
  );
};

export default DocumentRead;
