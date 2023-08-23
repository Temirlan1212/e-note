import React, { FC, Fragment } from "react";

import { Box, List, ListItem, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import useFetch from "@/hooks/useFetch";
import { IActionType } from "@/models/dictionaries/action-type";
import { format } from "date-fns";
import { useTheme } from "@mui/material/styles";
import { IApplication } from "@/models/applications/application-list";

interface IApplicationStatusReadProps {
  data: IApplicationStatus;
}

interface IApplicationStatus extends IApplication {
  product: {
    fullName: string;
  };
  createdOn: Date | string;
  statusSelect: number;
  notaryUniqNumber: string;
  notarySignatureStatus: number;
  company: {
    name: string;
  };
  requester: {
    fullName: string;
    name: string;
    lastName: string;
    middleName: string;
    mainAddress: {
      fullName: string;
    };
  }[];
  members: {
    fullName: string;
    name: string;
    lastName: string;
    middleName: string;
    mainAddress: {
      fullName: string;
    };
  }[];
}

const ApplicationStatusRead: FC<IApplicationStatusReadProps> = (props) => {
  const { data } = props;
  const theme = useTheme();
  const locale = useLocale();
  const t = useTranslations();

  const { data: statusData } = useFetch("/api/dictionaries/status", "POST");
  const { data: actionTypeData } = useFetch("/api/dictionaries/action-type", "POST");

  const translatedStatusTitle = (data, value) => {
    const matchedStatus = data?.find((item) => item.value == value);
    const translatedTitle = matchedStatus?.[("title_" + locale) as keyof IActionType];
    return !!translatedTitle ? translatedTitle : matchedStatus?.["title" as keyof IActionType] ?? "";
  };

  const titles = [
    { title: "Name", value: data?.product?.fullName },
    { title: "Type of notarial action", value: translatedStatusTitle(actionTypeData?.data, data?.typeNotarialAction) },
    { title: "StatusApplication", value: translatedStatusTitle(statusData?.data, data?.statusSelect) },
    { title: "Signature status", value: data?.notarySignatureStatus },
    {
      title: "Date of the action",
      value: data?.createdOn ? format(new Date(data?.createdOn!), "dd.MM.yyyy HH:mm:ss") : "",
    },
    { title: "Notary's full name", value: data?.company.name },
    { title: "Unique registry number", value: data?.notaryUniqNumber },
  ];

  const members = data?.requester.concat(data.members);

  return (
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
                }}
              >
                {t(el.value)}
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
                  {t(`${member.lastName} ${member.name} ${member.middleName}`)}
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
  );
};

export default ApplicationStatusRead;
