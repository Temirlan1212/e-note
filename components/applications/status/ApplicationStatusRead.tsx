import React, { FC } from "react";

import { Box, CircularProgress, List, ListItem, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import useFetch from "@/hooks/useFetch";
import { IActionType } from "@/models/action-type";
import { format } from "date-fns";
import { useTheme } from "@mui/material/styles";
import { IApplication } from "@/models/application";
import useEffectOnce from "@/hooks/useEffectOnce";
import { INotarialAction } from "@/models/notarial-action";
import { IPartner } from "@/models/user";

interface IApplicationStatusReadProps {
  data: IApplication;
  loading: boolean;
}

const capitalize = (str: string) => str?.[0].toUpperCase() + str?.slice(1);

const ApplicationStatusRead: FC<IApplicationStatusReadProps> = (props) => {
  const { data, loading } = props;
  const theme = useTheme();
  const locale = useLocale();
  const t = useTranslations();

  const { data: notarialActionStatus, update } = useFetch("", "GET");
  const { data: statusData, loading: statusDataLoading } = useFetch("/api/dictionaries/application-status", "POST");
  const { data: actionTypeData, loading: actionTypeDataLoading } = useFetch("/api/dictionaries/action-type", "POST");
  const { data: signatureStatusData, loading: signatureStatusDataLoading } = useFetch(
    "/api/dictionaries/notary-signature-status",
    "POST"
  );

  useEffectOnce(() => {
    data?.typeNotarialAction && update("/api/dictionaries/notarial-action/status/" + data?.typeNotarialAction);
  }, [data]);

  const translatedStatusTitle = (data: Record<string, any>[], value?: number) => {
    const matchedStatus = data?.find((item) => item.value == value);
    const translatedTitle = matchedStatus?.[("title_" + locale) as keyof IActionType];
    return !!translatedTitle ? translatedTitle : matchedStatus?.["title" as keyof IActionType] ?? "";
  };

  const getAddressFullName = (member: IPartner) => {
    const { mainAddress } = member || {};
    const { region, district, city, addressL4, addressL3, addressL2 } = mainAddress || {};

    const key = locale !== "en" ? "$t:name" : "name";
    const fallbackKey = locale !== "en" ? "name" : "$t:name";
    const formatAddressPart = (part: any) => part?.[key] || part?.[fallbackKey] || "";

    const formattedRegion = formatAddressPart(region);
    const formattedDistrict = formatAddressPart(district);
    const formattedCity = formatAddressPart(city);

    const addressParts = [
      [formattedRegion, formattedDistrict, formattedCity].filter(Boolean).join(", "),
      [addressL4, addressL3, addressL2].filter(Boolean).join(" "),
    ];

    return addressParts.filter(Boolean).join(", ");
  };

  const removeWords = (text: string | null, stopwords: string[]) => {
    if (text) {
      const words = text.split(" ");
      const filteredWords = words.filter(
        (word) => !stopwords.some((sw) => word.toLowerCase().includes(sw.toLowerCase()))
      );
      return filteredWords.join(" ");
    }
  };

  const titles = [
    { title: "StatusApplication", value: translatedStatusTitle(statusData?.data, data?.statusSelect) },
    {
      title: "Signature status",
      value: (
        <>
          {translatedStatusTitle(signatureStatusData?.data, data?.notarySignatureStatus)}
          {data?.notaryReason && (
            <Typography
              component="span"
              sx={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#ff5555",
                wordBreak: "break-all",
              }}
            >
              {" "}
              ({t("After editing")})
            </Typography>
          )}
        </>
      ),
    },
    data?.notaryReason ? { title: "Reason for correction", value: data.notaryReason } : null,
    {
      title: "Date of the action",
      value: data?.createdOn ? format(new Date(data?.createdOn!), "dd.MM.yyyy HH:mm:ss") : "",
    },
    { title: "Notary's full name", value: data?.company.partner?.fullName },
    { title: "Unique registry number", value: data?.notaryUniqNumber ?? t("not signed") },
    data?.orderNumber ? { title: "Previous document", value: data?.orderNumber ?? t("not signed") } : null,
    data?.notaryAnnulmentReason
      ? { title: "Annul reason str", value: data?.notaryAnnulmentReason ?? t("not signed") }
      : null,
    data?.notaryAnnulmentDate
      ? {
          title: "Annul date",
          value: format(new Date(data?.notaryAnnulmentDate), "dd.MM.yyyy HH:mm:ss") ?? t("not signed"),
        }
      : null,
    data?.notaryCancelledDate
      ? {
          title: "Cancel date",
          value: format(new Date(data?.notaryCancelledDate), "dd.MM.yyyy HH:mm:ss") ?? t("not signed"),
        }
      : null,
    data?.cancelReasonStr ? { title: "Cancel reason str", value: data?.cancelReasonStr ?? t("not signed") } : null,
    {
      title: "Date of signing",
      value: data?.notaryDocumentSignDate ? format(new Date(data?.notaryDocumentSignDate), "dd.MM.yyyy HH:mm:ss") : "",
    },
    {
      title: "Date of correction",
      value: data?.notaryReasonDate ? format(new Date(data?.notaryReasonDate), "dd.MM.yyyy HH:mm:ss") : "",
    },
  ].filter(Boolean);

  const members = data?.requester.concat(data.members);

  return !loading && !statusDataLoading && !actionTypeDataLoading && !signatureStatusDataLoading ? (
    <>
      {data?.notaryReason && (
        <Box
          sx={{
            background: "#f56666",
            padding: "10px",
            border: "1px solid #CDCDCD",
            boxShadow: "0px 0px 10px 2px rgba(34, 60, 80, 0.3)",
          }}
        >
          <Typography align="center" color="primary.contrastText" variant="h4">
            {t("Edited after signing")}
          </Typography>
        </Box>
      )}
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
                  {t(el?.title)}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#687C9B",
                    wordBreak: "break-all",
                  }}
                >
                  {el?.value != null && el?.value !== "" ? el?.value : t("absent")}
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
                    {member?.lastName} {member?.firstName} {member?.middleName}
                  </Typography>
                </Box>
              ))}
            </Box>
          </ListItem>
        </List>
      </Box>
    </>
  ) : (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <CircularProgress color="success" />
    </Box>
  );
};

export default ApplicationStatusRead;
