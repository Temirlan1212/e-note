import React, { FC } from "react";

import { Box, List, ListItem, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

interface IApplicationStatusReadProps {}

const titles = [
  { id: 1, title: "Name" },
  { id: 2, title: "Type of notarial action" },
  { id: 3, title: "StatusApplication" },
  { id: 4, title: "Signature status" },
  { id: 5, title: "Date of the action" },
  { id: 6, title: "Notary's full name" },
  { id: 7, title: "Unique registry number" },
  { id: 8, title: "Sides" },
];

const data = [
  { id: 1, title: "Доверенность на получение алиментов", type: "text" },
  { id: 2, title: "Удостоверение (доверенностей, договоров, фактов и др. сделки)", type: "text" },
  { id: 3, title: "На исполнении", type: "text" },
  { id: 4, title: "Не подписан", type: "text" },
  { id: 5, title: "01.01.2022 15:05:35", type: "text" },
  { id: 6, title: "ЧН Баланчаев Баланча Баланчаевич", type: "link" },
  { id: 7, title: "125-2023-4QwR5", type: "text" },
  {
    id: 8,
    type: "list",
    array: [
      {
        id: 1,
        user: "Участник-1",
        fullName: "Ташматов Акмат Ташматович",
        dateOfBirth: "03.05.1990",
        address: "Кыргызстан, г. Талас ул Манас 22",
      },
      {
        id: 2,
        user: "Участник-2",
        fullName: "Ташматов Акмат Ташматович",
        dateOfBirth: "03.05.1990",
        address: "Кыргызстан, г. Талас ул Манас 22",
      },
      {
        id: 3,
        user: "Участник-3",
        fullName: "Ташматов Акмат Ташматович",
        dateOfBirth: "03.05.1990",
        address: "Кыргызстан, г. Талас ул Манас 22",
      },
    ],
  },
];

const ApplicationStatusRead: FC<IApplicationStatusReadProps> = (props) => {
  const t = useTranslations();

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
        }}
      >
        {titles.map((el) => {
          return (
            <ListItem key={el.id}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {t(el.title)}
              </Typography>
            </ListItem>
          );
        })}
      </List>
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {data.map(({ type, id, title: text, array }) => {
          return (
            <ListItem key={id}>
              {type === "link" ? (
                <a
                  href="#"
                  style={{
                    color: "#1BAA75",
                    fontSize: "14px",
                  }}
                >
                  {text}
                </a>
              ) : (
                type === "text" && (
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: "#687C9B",
                      fontWeight: "500",
                    }}
                  >
                    {text}
                  </Typography>
                )
              )}
              {type === "list" && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gridTemplateRows: "auto",
                    gridColumnGap: "20px",
                    gridRowGap: "15px",
                  }}
                >
                  {array?.map((el) => {
                    return (
                      <Box
                        key={el.id}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "14px",
                            color: "#687C9B",
                            fontWeight: "500",
                          }}
                        >
                          {el.user}:
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            color: "#687C9B",
                            fontWeight: "500",
                          }}
                        >
                          {el.fullName}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            color: "#687C9B",
                            fontWeight: "500",
                          }}
                        >
                          {el.dateOfBirth}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            color: "#687C9B",
                            fontWeight: "500",
                          }}
                        >
                          {el.address}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default ApplicationStatusRead;
