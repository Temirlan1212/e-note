import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ApexOptions } from "apexcharts";
import { Box, CircularProgress, InputLabel, Typography, useMediaQuery } from "@mui/material";
import DatePicker from "@/components/ui/DatePicker";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { IAnalyticsItem } from "@/models/analytics";
import ApexChart from "../ui/ApexChart";
import { currentDate, formatDate, initialDate } from "@/components/analytics/Analytics";
import Button from "@/components/ui/Button";

export default function RegionsContent() {
  const t = useTranslations();
  const isMobileMedia = useMediaQuery("(max-width:800px)");
  const [startDate, setStartDate] = useState<Date | null>(initialDate);
  const [endDate, setEndDate] = useState<Date | null>(currentDate);

  const { data, update, loading } = useFetch<FetchResponseBody<IAnalyticsItem[]>>("", "POST");

  useEffect(() => {
    if (startDate && endDate) {
      update("/api/analytics/regions", {
        startDate: formatDate(startDate.toISOString()),
        endDate: formatDate(endDate.toISOString()),
      });
    }
  }, []);

  const handleDateSubmit = () => {
    if (startDate && endDate) {
      update("/api/analytics/regions", {
        startDate: formatDate(startDate.toISOString()),
        endDate: formatDate(endDate.toISOString()),
      });
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
        <Box sx={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
          <DatePicker sx={{ maxWidth: "320px" }} value={startDate} onChange={(date: Date) => setStartDate(date)} />
          <Typography>{t("FromTo")}</Typography>
          <DatePicker sx={{ maxWidth: "320px" }} value={endDate} onChange={(date: Date) => setEndDate(date)} />
          <Button sx={{ width: "auto" }} onClick={handleDateSubmit}>
            {t("Generate report")}
          </Button>
        </Box>
      </Box>

      {!data?.data ? (
        <Typography variant="h5">{t("Analytics is unavailable")}</Typography>
      ) : loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <ApexChart height={600} options={options} series={series} type={"bar"} />
      )}
    </>
  );
}
