import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ApexOptions } from "apexcharts";
import { Box, CircularProgress, Typography, useMediaQuery } from "@mui/material";
import Button from "../ui/Button";
import DatePicker from "@/components/ui/DatePicker";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { subMonths } from "date-fns";
import { IAnalyticsData } from "@/models/analytics";
import ApexChart from "../ui/ApexChart";
import { Table, TableBody, TableRow, TableCell } from "@mui/material";
import Accordion from "@/components/ui/Accordion";

const currentDate = new Date();
const initialDate = subMonths(currentDate, 3);
const formatDate = (date: string): string => {
  return date?.slice(0, -1);
};

export default function AnalyticsContent() {
  const t = useTranslations();
  const isMobileMedia = useMediaQuery("(max-width:800px)");
  const [selectedDate, setSelectedDate] = useState<string | Date>(formatDate(initialDate.toISOString()));
  const [formattedDate, setFormattedDate] = useState<string | Date>();
  const [selectedTab, setSelectedTab] = useState<keyof typeof tabsContent>(1);
  const [expanded, setExpanded] = useState<number | false>(0);

  const handleQAExpanding = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    if (expanded === panel) {
      setExpanded(false);
    } else {
      setExpanded(panel);
    }
  };

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
      followCursor: true,
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

  const handleDateChange = (value: string): void => {
    const date = new Date(value).toISOString();
    setFormattedDate(formatDate(date));
  };

  const handleDateSubmit = (): void => {
    if (formattedDate) {
      setSelectedDate(formattedDate as string);
    }
  };

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
    1: (
      <Box maxHeight="600px" sx={{ overflowY: "auto", overflowX: "hidden", padding: "0 10px" }}>
        <ApexChart options={options} series={series} type="bar" height={(companyValues?.length ?? 10) * 30} />
      </Box>
    ),
    2: <ApexChart height={600} options={options} series={series} type={"bar"} />,
    3: (
      <Box maxHeight="600px" sx={{ overflowY: "auto", overflowX: "hidden", padding: "0 10px" }}>
        <ApexChart options={options} series={series} type="bar" height={(companyValues?.length ?? 10) * 30} />
      </Box>
    ),
    4: (
      <Box>
        {data?.data?.table.map((notaries, index) => (
          <Accordion
            key={index}
            expanded={expanded === index}
            title={notaries.regionName + " " + notaries.notaries.length}
            handleChange={handleQAExpanding(index)}
            type={notaries.regionName}
            sx={{
              marginBottom: "10px",
              bgcolor: "transparent",
            }}
          >
            <Table key={index}>
              <TableBody>
                {notaries.notaries.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell sx={{ fontWeight: 500 }}>{item.name}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{item.actionCounter}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Accordion>
        ))}
      </Box>
    ),
  };

  if (!companyValues) return <></>;

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
        {selectedTab !== 3 && (
          <DatePicker
            sx={{ maxWidth: "320px" }}
            value={initialDate}
            onClose={handleDateSubmit}
            onChange={handleDateChange}
          />
        )}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "600px" }}>
            <CircularProgress />
          </Box>
        ) : (
          tabsContent[selectedTab]
        )}
      </Box>
    </Box>
  );
}
