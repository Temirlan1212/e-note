import { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import useConvert from "@/hooks/useConvert";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@/components/ui/Button";
import PDFViewer from "@/components/PDFViewer";
import Link from "@/components/ui/Link";
import SignModal from "@/components/e-sign/SignModal";
import StepperContentStep from "@/components/ui/StepperContentStep";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  stepState: [number, Dispatch<SetStateAction<number>>];
  onPrev?: Function;
  onNext?: Function;
}

export default function SixthStepFields({ form, stepState, onPrev, onNext }: IStepFieldsProps) {
  const t = useTranslations();
  const convert = useConvert();

  const { trigger, control, watch, setValue } = form;

  const id = watch("id");

  const [base64Doc, setBase64Doc] = useState<string>();
  const [docUrl, setDocUrl] = useState<string>();

  const { data, loading } = useFetch(id != null ? `/api/files/prepare/${id}` : "", "GET");
  const { data: conversionData, loading: conversionLoading } = useFetch(
    id != null ? `/api/files/document-conversion/${id}` : "",
    "GET"
  );
  const { update: getPdf } = useFetch<Response>("", "GET", { returnResponse: true });

  useEffectOnce(() => {
    if (data?.data?.saleOrderVersion != null) {
      setValue("version", data.data.saleOrderVersion);
    }
  }, [data]);

  useEffectOnce(async () => {
    if (conversionData?.data?.pdfLink != null && data?.data?.token != null) {
      const pdfResponse = await getPdf(`/api/adapter?url=${conversionData?.data?.pdfLink}&token=${data?.data?.token}`);
      const blob = await pdfResponse?.blob();
      if (blob == null) return;

      setBase64Doc(await convert.blob.toBase64Async(blob));
      setDocUrl(URL.createObjectURL(blob));
    }
  }, [data, conversionData]);

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

  const handleSign = (sign: string) => {
    console.log(sign);
  };

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Box display="flex" justifyContent="space-between" gap="20px" flexDirection={{ xs: "column", lg: "row" }}>
        <StepperContentStep step={6} title={t("View document")} loading={loading || conversionLoading} />

        <Box display="flex" gap="10px" flexDirection={{ xs: "column", md: "row" }}>
          {docUrl && (
            <Link href={docUrl} target="_blank">
              <Button startIcon={<PictureAsPdfIcon />} sx={{ width: "auto" }}>
                {t("Download PDF")}
              </Button>
            </Link>
          )}

          {data?.data?.token && (
            <Link
              href={`${data?.data?.editUrl}?AuthorizationBasic=${data?.data?.token.replace(/Basic /, "")}`}
              target="_blank"
            >
              <Button startIcon={<EditIcon />} sx={{ width: "auto" }}>
                {t("Edit")}
              </Button>
            </Link>
          )}

          {base64Doc != null && <SignModal base64Doc={base64Doc} onSign={handleSign} />}
        </Box>
      </Box>

      {docUrl && <PDFViewer fileUrl={docUrl} />}

      {!loading && !conversionLoading && (
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
      )}
    </Box>
  );
}
