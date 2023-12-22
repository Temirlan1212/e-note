import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ApexOptions } from "apexcharts";
import { Box, InputLabel, Typography, useMediaQuery } from "@mui/material";
import DatePicker from "@/components/ui/DatePicker";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { IAnalyticsItem } from "@/models/analytics";
import ApexChart from "../ui/ApexChart";
import { currentDate, formatDate, initialDate } from "@/components/analytics/Analytics";

export default function RegionsContent() {
  const t = useTranslations();
  const isMobileMedia = useMediaQuery("(max-width:800px)");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [formattedDate, setFormattedDate] = useState<Date>();

  const { data, update, loading } = useFetch<FetchResponseBody<IAnalyticsItem[]>>("", "POST");

  useEffect(() => {
    if (startDate && endDate) {
      update(`/api/analytics/regions`, {
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

  const labels = data?.data?.map((company) => company.name);
  const values = data?.data?.map((company) => company.actionCounter);

  const series: ApexOptions["series"] = [
    {
      name: t("Number of notarial acts"),
      data: values!,
    },
  ];

  const options: ApexOptions = {
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
      },
    },
    labels: labels ?? [],
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
      <ApexChart height={600} options={options} series={series} type={"bar"} />
    </>
  );
}