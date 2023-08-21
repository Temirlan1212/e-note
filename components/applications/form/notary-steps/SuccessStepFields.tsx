import { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { IApplicationSchema } from "@/validator-schemas/application";
import { Alert, AlertProps, Box, Collapse, Typography } from "@mui/material";
import Button from "@/components/ui/Button";
import Hint from "@/components/ui/Hint";
import { GridTable } from "@/components/ui/GridTable";
import Input from "@/components/ui/Input";
import SendIcon from "@mui/icons-material/Send";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplicationSchema>;
  stepState: [number, Dispatch<SetStateAction<number>>];
  onPrev?: Function;
  onNext?: Function;
}

const alertStatusText = {
  error: "Произошла ошибка, попробуйте отправить заново.",
  success: "Сообщение успешно отправлено.",
  info: "",
  warning: "",
};

export default function SuccessStepFields({ form, stepState, onPrev, onNext }: IStepFieldsProps) {
  const t = useTranslations();
  const [alert, setAlert] = useState<AlertProps & { open: boolean }>({
    open: false,
    severity: "warning",
  });

  const {
    trigger,
    register,
    formState: {
      errors: { textAreaMessage },
    },
  } = form;

  const triggerFields = async () => {
    return await trigger(["textAreaMessage"]);
  };

  return (
    <Box display="flex" gap="30px" flexDirection="column">
      <Hint type="hint">
        <Typography fontSize={"18px"} fontWeight={600}>
          {t("The notarial action is entered in the register")}
        </Typography>
      </Hint>

      <Box display="flex" flexDirection="column" gap="30px">
        <GridTable rows={[]} columns={[]} />

        <Box width={{ xs: "100%", sm: "fit-content" }}>
          <Button>{t("Add to my templates")}</Button>
        </Box>

        <Box>
          <Typography>{t("Write a message to the applicant")}</Typography>

          <Box display="flex" alignItems="start">
            <Box minHeight="80px" width="100%" borderRadius="0px !important">
              <Input
                multiline
                register={register}
                name="textAreaMessage"
                error={!!textAreaMessage?.message}
                helperText={textAreaMessage?.message}
              />
            </Box>

            <Button sx={{ height: "75px", width: "auto", mb: "5px" }} onClick={triggerFields}>
              <SendIcon />
            </Button>
          </Box>
          <Collapse in={alert.open}>
            <Alert
              severity={alert.severity}
              onClose={() =>
                setAlert((prev) => {
                  return { ...prev, open: false };
                })
              }
            >
              {alertStatusText[alert.severity ?? "info"]}
            </Alert>
          </Collapse>
        </Box>
      </Box>

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Button startIcon={<PostAddIcon />} sx={{ width: "auto", height: "50px" }}>
          <Typography>{t("Issue a new action")}</Typography>
        </Button>
        <Button startIcon={<ModeEditIcon />} sx={{ width: "auto", height: "50px" }} buttonType="secondary">
          <Typography>{t("Go to notary actions")}</Typography>
        </Button>
      </Box>
    </Box>
  );
}
