import useEffectOnce from "@/hooks/useEffectOnce";
import { CircularProgress } from "@mui/material";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useRef } from "react";
import { Props } from "react-apexcharts";

const ReactApexChart = dynamic(
  () => {
    return import("react-apexcharts");
  },
  { loading: () => <CircularProgress />, ssr: false }
);

const ApexChart = (props: Props) => {
  const router = useRouter();
  const ref = useRef<{ retry: () => void }>(null);
  const t = useTranslations();
  const locale = router.locale ?? "ru";

  const locales = [
    {
      name: locale,
      options: {
        toolbar: {
          exportToSVG: t("Download SVG"),
          exportToPNG: t("Download PNG"),
          selection: t("Selection"),
          selectionZoom: t("Selection Zoom"),
          zoomIn: t("Zoom In"),
          zoomOut: t("Zoom Out"),
          pan: t("Panning"),
        },
      },
    },
  ];

  const options: Props = {
    ...props,
    options: {
      ...(props?.options ?? {}),
      chart: {
        ...(props.options?.chart ?? {}),
        defaultLocale: locale,
        locales,
      },
    },
  };

  useEffectOnce(() => {
    if (locale == null || ref.current == null) return;
    ref.current.retry();
  }, [locale]);

  return <ReactApexChart ref={ref} {...options} />;
};

export default ApexChart;
