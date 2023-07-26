import { useState } from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { IApplication } from "@/models/applications/application";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplication>;
}

export default function FirstStepFields({ form }: IStepFieldsProps) {
  const t = useTranslations();

  const {
    formState: { errors },
    setError,
    reset,
    register,
  } = form;

  return (
    <Box display="flex" flexDirection="column" gap="30px">
      <FormControl sx={{ width: "100%" }}>
        <InputLabel
          sx={{
            color: "#24334B",
            fontSize: "18px",
            top: "10px",
            left: "-14px",
            fontWeight: "500",
            position: "inherit",
          }}
          shrink
        >
          {t("Name")}
        </InputLabel>
        <Input
          fullWidth
          error={!!errors.name?.message ?? false}
          helperText={t(errors.name?.message)}
          register={register}
          name="name"
        />
      </FormControl>
    </Box>
  );
}
