import React, { FC, useState } from "react";

import { Box, Typography } from "@mui/material";

import Accordion from "@/components/ui/Accordion";
import Link from "@/components/ui/Link";
import { useTranslations } from "next-intl";
import { IHeir } from "@/models/heir";

type IHeirAccordionProps = {
  foundedData: IHeir[];
};

const HeirAccordion: FC<IHeirAccordionProps> = ({ foundedData }) => {
  const t = useTranslations();

  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

  const handleAccordionExpanding = (index: number) => {
    setExpandedMap((prevState) => ({
      ...prevState,
      [index]: !prevState[index] || false,
    }));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "3px", margin: "0 auto" }}>
      {foundedData.map((item: IHeir, key: number) => (
        <Accordion
          key={key}
          expanded={expandedMap[key]}
          title={item?.["requester.fullName"]}
          handleChange={() => handleAccordionExpanding(key)}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Typography>
              <b>{t("Testator")}: </b> {item?.["requester.fullName"]}
            </Typography>

            <Typography>
              <b>{t("Date of death")}: </b> {item?.["requester.deathDate"]}
            </Typography>

            <Typography>
              <b>{t("Unique number")}: </b> {item?.notaryUniqNumber ?? t("not assigned")}
            </Typography>

            <Typography>
              <b>{t("Opened by a notary")}: </b>
              <Link sx={{ color: "#1BAA75", textDecoration: "underline" }} href={`/notaries/${item?.["company.id"]}`}>
                {item?.["company.name"]}
              </Link>
            </Typography>
          </Box>
        </Accordion>
      ))}
    </Box>
  );
};

export default HeirAccordion;
