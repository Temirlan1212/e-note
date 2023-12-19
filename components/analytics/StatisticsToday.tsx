import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { ApexOptions } from "apexcharts";
import { Box, useMediaQuery } from "@mui/material";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { subDays } from "date-fns";
import { IAnalyticsItem } from "@/models/analytics";
import ApexChart from "../ui/ApexChart";

const currentDate = new Date();
const initialDate = subDays(currentDate, 1);
const formatDate = (date: string): string => {
  return date?.slice(0, -1);
};

export default function StatisticsTodayContent() {
  const t = useTranslations();
  const isMobileMedia = useMediaQuery("(max-width:800px)");

  const { data, update, loading } = useFetch<FetchResponseBody<IAnalyticsItem[]>>("", "POST");

  useEffect(() => {
    update("/api/analytics/companies", {
      startDate: formatDate(initialDate.toISOString()), // Начальная дата
      endDate: formatDate(currentDate.toISOString()), // Конечная дата
    });
  }, []);

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
        horizontal: true,
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
    <Box maxHeight="600px" sx={{ overflowY: "auto", overflowX: "hidden", padding: "0 10px" }}>
      <ApexChart options={options} series={series} type="bar" height={(values?.length ?? 10) * 30} />
    </Box>
  );
}
