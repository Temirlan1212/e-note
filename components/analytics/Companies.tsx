import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ApexOptions } from "apexcharts";
import { Box, InputLabel, Typography, useMediaQuery } from "@mui/material";
import DatePicker from "@/components/ui/DatePicker";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { IAnalyticsItem } from "@/models/analytics";
import ApexChart from "../ui/ApexChart";
import { currentDate, formatDate, initialDate } from "@/components/analytics/Analytics";

export default function CompanyContent() {
  const t = useTranslations();
  const isMobileMedia = useMediaQuery("(max-width:800px)");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [formattedDate, setFormattedDate] = useState<Date>();

  const { data, update, loading } = useFetch<FetchResponseBody<IAnalyticsItem[]>>("", "POST");

  useEffect(() => {
    if (startDate && endDate) {
      update("/api/analytics/companies", {
        startDate: formatDate(startDate.toISOString()), // Начальная дата
        endDate: formatDate(endDate.toISOString()), // Конечная дата
      });
    }
  }, [startDate, endDate]);

  useEffect(() => {
    setStartDate(initialDate);
    setEndDate(currentDate);
  }, []);

  const handleDateChange = (date: Date) => {
    setFormattedDate(date);
  };

  const handleStartDateSubmit = (): void => {
    if (formattedDate) {
      setStartDate(formattedDate);
    }
  };

  const handleEndDateSubmit = (): void => {
    if (formattedDate) {
      setEndDate(formattedDate);
    }
  };

  if (!Array.isArray(data?.data)) {
    return <Typography variant="h5">{t("Analytics is unavailable")}</Typography>;
  }

  const companyLabels = data?.data?.map((company) => company.name);
  const companyValues = data?.data?.map((company) => company.actionCounter);

  const series: ApexOptions["series"] = [
    {
      name: t("Number of notarial acts"),
      data: companyValues!,
    },
  ];

  const options: ApexOptions = {
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
      },
    },
    labels: companyLabels ?? [],
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

  return (
    <>
      <Box>
        <InputLabel>Дата</InputLabel>
        <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <DatePicker
            sx={{ maxWidth: "320px" }}
            value={startDate}
            onChange={handleDateChange}
            onClose={handleStartDateSubmit}
          />
          <Typography>{t("FromTo")}</Typography>
          <DatePicker
            sx={{ maxWidth: "320px" }}
            value={endDate}
            onChange={handleDateChange}
            onClose={handleEndDateSubmit}
          />
        </Box>
      </Box>

      <Box maxHeight="600px" sx={{ overflowY: "auto", overflowX: "hidden", padding: "0 10px" }}>
        <ApexChart options={options} series={series} type="bar" height={(companyValues?.length ?? 10) * 30} />
      </Box>
    </>
  );
}
