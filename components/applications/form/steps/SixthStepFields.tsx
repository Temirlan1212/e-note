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

export default function SixthStepFields({ form }: IStepFieldsProps) {
  const t = useTranslations();

  const {
    formState: { errors },
    setError,
    reset,
  } = form;

  return (
    <Box display="flex" flexDirection="column" gap="30px">
      6
    </Box>
  );
}
