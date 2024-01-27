import { Alert, Box, Collapse, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { IInheritanceCaseCreateSchema, inheritanceCaseCreateSchema } from "@/validator-schemas/inheritance-cases";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/components/ui/Button";
import { useRouter } from "next/router";
import useNavigationConfirmation from "@/hooks/useNavigationConfirmation";
import CreateFormFields from "./CreateFormFields";
import { useState } from "react";
import FetchTundukData from "./FetchTundukData";
import Link from "next/link";
import { isNewInheritanceCase } from "./lib/_requests";
import useFetch from "@/hooks/useFetch";
import { format } from "date-fns";
import CancelIcon from "@mui/icons-material/Cancel";

export default function InheritanceCaseCreate() {
  const [error, setError] = useState<{ message: string; link?: string }>({ message: "" });
  const { update: update, loading } = useFetch("", "POST");
  const t = useTranslations();
  const router = useRouter();

  const form = useForm<IInheritanceCaseCreateSchema>({
    mode: "all",
    resolver: yupResolver<IInheritanceCaseCreateSchema>(inheritanceCaseCreateSchema),
  });

  const submitHandler: SubmitHandler<IInheritanceCaseCreateSchema> = async (data) => {
    setError({ message: "" });
    const pin = form.getValues("requester.0.personalNumber");
    const existedInheritanceCaseId = await isNewInheritanceCase(pin, update);
    if (existedInheritanceCaseId) {
      setError({
        message: "Such a inheritance case already exists",
        link: `/inheritance-cases/${existedInheritanceCaseId}`,
      });
      return;
    }

    if (!data?.company) {
    }

    const res = await update("/api/applications/create", {
      ...data,
      creationDate: format(new Date(), "yyyy-MM-dd"),
      notaryIsInheritance: true,
    });

    if (res?.status === 0 && res?.data) {
      router.back();
    }
  };

  const resetHandler = () => {
    router.back();
  };

  useNavigationConfirmation(form.formState.isDirty);

  return (
    <Box
      component="form"
      width="100%"
      display="flex"
      flexDirection="column"
      gap="20px"
      onReset={resetHandler}
      onSubmit={form.handleSubmit(submitHandler)}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h3" color="success.main" fontWeight="600">
          {t("Creation of an inheritance case")}
        </Typography>
        <Button startIcon={<CancelIcon />} sx={{ width: "fit-content" }} type="reset" buttonType="secondary">
          {t("Cancel")}
        </Button>
      </Box>

      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        gap="20px"
        position="relative"
        mb={3}
        p={3}
        pt={5}
        boxShadow={4}
        borderRadius={1}
      >
        <Typography variant="h4" fontWeight="600">
          {t("Information about the deceased")}
        </Typography>
        <Collapse in={!!error.message}>
          <Alert
            severity="warning"
            onClose={() => setError({ message: "" })}
            sx={{ display: "flex", alignItems: "center", gap: "20px", position: "relative", zIndex: 2 }}
          >
            {t(error.message || "Something went wrong")} <br />
            {!!error.link && <Link href={error.link}>{t("Go into an inheritance case")}</Link>}
          </Alert>
        </Collapse>

        <FetchTundukData form={form} setError={setError} />
        <CreateFormFields form={form} />
        <Button type="submit" loading={loading}>
          {t("Save")}
        </Button>
      </Box>
    </Box>
  );
}
