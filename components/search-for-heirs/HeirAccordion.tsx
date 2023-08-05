import * as React from "react";

import { Box, Typography } from "@mui/material";

import Accordion from "../ui/Accordion";
import Link from "../ui/Link";
import { useTranslations } from "next-intl";

type IHeirAccordionProps = {};

const heirTypesData = [
  {
    title: "Нурмырзаев Баккелди Бекмолдоевич",
    type: "user1",
  },
  {
    title: "Нурмырзаев Баккелди Бекмолдоевич",
    type: "user2",
  },
  {
    title: "Нурмырзаев Баккелди Бекмолдоевич",
    type: "user3",
  },
  {
    title: "Нурмырзаев Баккелди Бекмолдоевич",
    type: "user4",
  },
];

const HeirAccordion = (props: IHeirAccordionProps) => {
  const t = useTranslations();

  const [heirExpanded, setHeirExpanded] = React.useState<string | false>();

  const handleHeirExpanding = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setHeirExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "3px", margin: "0 auto" }}>
      {heirTypesData.map(({ title, type }) => (
        <Accordion key={type} expanded={heirExpanded === type} title={title} handleChange={handleHeirExpanding(type)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Typography>
              <b>{t("Testator")}:</b> {title}
            </Typography>
            <Typography>
              <b>{t("Heir")}:</b> Бекмолдоев Акбар Баккелдиевич
            </Typography>
            <Typography>
              <b>{t("Notary")}:</b>{" "}
              <Link sx={{ color: "#1BAA75", textDecoration: "underline" }} href="#">
                Частный нотариус Баланчаев Б.Б.
              </Link>
            </Typography>
          </Box>
        </Accordion>
      ))}
    </Box>
  );
};

export default HeirAccordion;