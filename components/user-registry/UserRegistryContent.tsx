import { FC } from "react";

import { Box } from "@mui/material";
import { useTranslations } from "next-intl";

import UserRegistryFiltration from "./UserRegistryFiltration";
import UserRegistryTableList from "./UserRegistryTableList";
import Button from "../ui/Button";

interface IUserRegistryContentProps {}

const UserRegistryContent: FC<IUserRegistryContentProps> = (props) => {
  const t = useTranslations();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
      }}
    >
      <Button
        color="success"
        sx={{
          width: "320px",
          margin: {
            xs: "0 auto",
            sm: "0 auto 0 0",
          },
        }}
      >
        {t("Add a new user")}
      </Button>
      <UserRegistryFiltration />
      <UserRegistryTableList />
    </Box>
  );
};

export default UserRegistryContent;
