import { useState } from "react";
import { useTranslations } from "next-intl";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Button from "../ui/Button";
import CompanyContent from "@/components/analytics/Companies";
import RegionsContent from "@/components/analytics/Regions";
import AnalyticsTable from "@/components/analytics/Table";
import StatisticsTodayContent from "@/components/analytics/StatisticsToday";
import { startOfMonth } from "date-fns";

export const currentDate = new Date();
export const initialDate = startOfMonth(currentDate);
export const formatDate = (date: string): string => {
  return date?.slice(0, -1);
};

export default function AnalyticsContent() {
  const t = useTranslations();
  const isMobileMedia = useMediaQuery("(max-width:800px)");
  const [selectedTab, setSelectedTab] = useState<keyof typeof tabsContent>(1);

  const tabs: { id: keyof typeof tabsContent; text: string }[] = [
    {
      id: 1,
      text: "Statistics on notaries",
    },
    {
      id: 2,
      text: "Statistics by region",
    },
    {
      id: 3,
      text: "Statistics for today",
    },
    {
      id: 4,
      text: "Tabular view",
    },
  ];

  const tabsContent = {
    1: <CompanyContent />,
    2: <RegionsContent />,
    3: <StatisticsTodayContent />,
    4: <AnalyticsTable />,
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <Typography variant="h4" color="success.main">
        {t("Analytics")}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "20px",
            flexWrap: isMobileMedia ? "wrap" : "unset",
          }}
        >
          {tabs.map((tab) => {
            const isActive = selectedTab === tab.id;

            return (
              <Button
                key={tab.id}
                variant={isActive ? "contained" : "text"}
                sx={{
                  fontSize: { sm: "12px", md: "16px" },
                  boxShadow: isActive ? "0px 10px 20px 0px #99DBAF" : "",
                  background: isActive ? "" : "#EFEFEF",
                  padding: "10px 0",
                  "&:hover": {
                    color: "#EFEFEF",
                  },
                }}
                onClick={() => setSelectedTab(tab.id)}
              >
                {t(tab.text)}
              </Button>
            );
          })}
        </Box>
        {tabsContent[selectedTab]}
      </Box>
    </Box>
  );
}
