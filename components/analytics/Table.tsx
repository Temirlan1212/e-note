import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Box, CircularProgress, InputLabel, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import DatePicker from "@/components/ui/DatePicker";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { IAnalyticsItem } from "@/models/analytics";
import Accordion from "@/components/ui/Accordion";
import { currentDate, formatDate, initialDate } from "@/components/analytics/Analytics";
import Button from "@/components/ui/Button";

export default function AnalyticsTable() {
  const t = useTranslations();
  const [startDate, setStartDate] = useState<Date | null>(initialDate);
  const [endDate, setEndDate] = useState<Date | null>(currentDate);
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
      update("/api/analytics/table", {
        startDate: formatDate(startDate.toISOString()),
        endDate: formatDate(endDate.toISOString()),
      });
    }
  }, []);

  const handleDateSubmit = () => {
    if (startDate && endDate) {
      update("/api/analytics/table", {
        startDate: formatDate(startDate.toISOString()),
        endDate: formatDate(endDate.toISOString()),
      });
    }
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
        <Box>
          <CircularProgress />
        </Box>
      ) : (
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
      )}
    </>
  );
}
