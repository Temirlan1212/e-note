import { useState } from "react";
import { useTranslations } from "next-intl";
import { ApexOptions } from "apexcharts";
import { Box, CircularProgress, Typography, useMediaQuery } from "@mui/material";
import Button from "../ui/Button";
import DatePicker from "@/components/ui/DatePicker";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { subMonths } from "date-fns";
import { IAnalyticsData } from "@/models/analytics";
import ApexChart from "../ui/ApexChart";

const currentDate = new Date();
const initialDate = subMonths(currentDate, 3);
const formatDate = (date: string): string => {
  return date?.slice(0, -1);
};

export default function AnalyticsContent() {
  const t = useTranslations();
  const isMobileMedia = useMediaQuery("(max-width:800px)");
  const [selectedDate, setSelectedDate] = useState<string | Date>(formatDate(initialDate.toISOString()));
  const [selectedTab, setSelectedTab] = useState<number>(1);

  const { data, loading } = useFetch<FetchResponseBody<IAnalyticsData>>(
    `/api/analytics/${selectedTab === 3 ? formatDate(currentDate.toISOString()) : selectedDate}`,
    "POST"
  );

  const companyLabels = data?.data?.company.map((company) => company.name);
  const companyValues = data?.data?.company.map((company) => company.actionCounter);

  const regionLabels = data?.data?.region.map((company) => company.name);
  const regionValues = data?.data?.region.map((company) => company.actionCounter);

  const series: ApexOptions["series"] = [
    {
      name: t("Number of notarial acts"),
      data: selectedTab === 2 ? regionValues! : companyValues!,
    },
  ];

  const options: ApexOptions = {
    plotOptions: {
      bar: {
        horizontal: selectedTab !== 2,
        borderRadius: 4,
      },
    },
    labels: selectedTab === 2 ? regionLabels ?? [] : companyLabels ?? [],
    tooltip: {
      shared: true,
      intersect: false,
      x: {
        formatter(val: number): string {
          return `<div style="white-space: pre-wrap">${val}</div>`;
        },
      },
      y: {
        title: {
          formatter(seriesName: string): string {
            return `<div style="white-space: pre-wrap">${seriesName}</div>`;
          },
        },
      },
    },
    yaxis: {
      labels: {
        maxWidth: isMobileMedia ? 100 : +"100%",
        style: {
          fontSize: isMobileMedia ? "12px" : "14px",
        },
      },
    },
    xaxis: {
      labels: {
        maxHeight: isMobileMedia ? 100 : +"100%",
        style: {
          fontSize: isMobileMedia ? "12px" : "14px",
        },
      },
    },
  };

  const handleDateChange = (value: string) => {
    const date = new Date(value).toISOString();
    setSelectedDate(formatDate(date));
  };

  const tabs = [
    {
      id: 1,
      text: "Statistics on notaries",
      click: () => setSelectedTab(1),
    },
    {
      id: 2,
      text: "Statistics by region",
      click: () => setSelectedTab(2),
    },
    {
      id: 3,
      text: "Statistics for today",
      click: () => setSelectedTab(3),
    },
    {
      id: 4,
      text: "Tabular view",
      click: () => setSelectedTab(4),
    },
  ];

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
                onClick={tab.click}
              >
                {t(tab.text)}
              </Button>
            );
          })}
        </Box>
        {selectedTab !== 3 && <DatePicker sx={{ maxWidth: "320px" }} value={initialDate} onChange={handleDateChange} />}
        <Box>
          {selectedTab === 4 ? (
            <Box>Table</Box>
          ) : loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "600px" }}>
              <CircularProgress />
            </Box>
          ) : (
            <ApexChart height={600} options={options} series={series} type={"bar"} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
