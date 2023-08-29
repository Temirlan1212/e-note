import { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import PDFViewer from "@/components/PDFViewer";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Link from "@/components/ui/Link";
import StepperContentStep from "@/components/ui/StepperContentStep";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  stepState: [number, Dispatch<SetStateAction<number>>];
  onPrev?: Function;
  onNext?: Function;
}

export default function SixthStepFields({ form, stepState, onPrev, onNext }: IStepFieldsProps) {
  const t = useTranslations();

  const { trigger, control, watch, setValue } = form;

  const id = watch("id");

  const [iframeContent, setIframeContent] = useState("");

  const { data } = useFetch(id != null ? `/api/files/prepare/${id}` : "", "GET");

  useEffectOnce(async () => {
    if (data?.data?.saleOrderVersion != null) {
      setValue("version", data.data.saleOrderVersion);
    }
  }, [data]);

  const triggerFields = async () => {
    return await trigger([]);
  };

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const handleNextClick = async () => {
    const validated = await triggerFields();
    if (onNext != null && validated) onNext();
  };

  return (
    <Box display="flex" gap="20px">
      <StepperContentStep onlyCurrentStep currentStep={6} />
      <Box
        width="100%"
        display="flex"
        gap="30px"
        flexDirection="column"
        sx={{
          marginTop: { xs: "0", md: "16px" },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          gap={{ xs: "20px", md: "200px" }}
          flexDirection={{ xs: "column", md: "row" }}
        >
          <Typography variant="h4" whiteSpace="nowrap">
            {t("View document")}
          </Typography>

          <Link
            href={`/api/iframe?url=${data?.data?.downloadUrl}&token=${data?.data?.token}`}
            download={data?.data?.fileName}
            target="_blank"
          >
            <Button startIcon={<PictureAsPdfIcon />} sx={{ width: "auto" }}>
              {t("Download PDF")}
            </Button>
          </Link>
        </Box>

        {data?.data?.token != null && (
          <Link
            href={
              process.env.NEXT_PUBLIC_NEXTCLOUD_URL +
              `/notarynew/index.php/auth-redirect?redirectUrl=${data?.data
                ?.editUrl}&authorizationBasic=${data?.data?.token.replace(/Basic /, "")}`
            }
            target="_blank"
          >
            ok
          </Link>
        )}

        <PDFViewer fileUrl="/documents/example.pdf" />

        <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
          {onPrev != null && (
            <Button onClick={handlePrevClick} startIcon={<ArrowBackIcon />} sx={{ width: "auto" }}>
              {t("Prev")}
            </Button>
          )}
          {onNext != null && (
            <Button onClick={handleNextClick} endIcon={<ArrowForwardIcon />} sx={{ width: "auto" }}>
              {t("Next")}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
