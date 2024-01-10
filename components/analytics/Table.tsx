import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Box, InputLabel, Table, TableBody, TableCell, TableRow, Typography, useMediaQuery } from "@mui/material";
import DatePicker from "@/components/ui/DatePicker";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { IAnalyticsItem } from "@/models/analytics";
import Accordion from "@/components/ui/Accordion";
import { currentDate, formatDate, initialDate } from "@/components/analytics/Analytics";

export default function AnalyticsTable() {
  const t = useTranslations();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [formattedDate, setFormattedDate] = useState<Date>();
  const [expanded, setExpanded] = useState<number | false>(0);

  const { data, update, loading } = useFetch<FetchResponseBody<IAnalyticsItem[]>>("", "POST");

  const handleQAExpanding = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    if (expanded === panel) {
      setExpanded(false);
    } else {
      setExpanded(panel);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      update(`/api/analytics/table`, {
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
      <Box>
        {data?.data?.map(({ regionName, notaries, totalAction }, index) => (
          <Accordion
            key={index}
            expanded={expanded === index}
            title={regionName + " " + totalAction}
            handleChange={handleQAExpanding(index)}
            type={regionName}
            sx={{
              marginBottom: "10px",
              bgcolor: "transparent",
            }}
          >
            <Table key={index}>
              <TableBody>
                {notaries?.map((notary) => (
                  <TableRow key={notary.name}>
                    <TableCell sx={{ fontWeight: 500 }}>{notary.name}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{notary.actionCounter}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Accordion>
        ))}
      </Box>
    </>
  );
}
