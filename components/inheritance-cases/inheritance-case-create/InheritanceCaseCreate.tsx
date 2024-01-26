import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { IInheritanceCaseCreateSchema, inheritanceCaseCreateSchema } from "@/validator-schemas/inheritance-cases";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CreateFormFields from "./CreateFormFields";
import Button from "@/components/ui/Button";
import { useRouter } from "next/router";
import useNavigationConfirmation from "@/hooks/useNavigationConfirmation";

export default function InheritanceCaseCreate() {
  const t = useTranslations();
  const router = useRouter();

  const form = useForm<IInheritanceCaseCreateSchema>({
    mode: "all",
    resolver: yupResolver<IInheritanceCaseCreateSchema>(inheritanceCaseCreateSchema),
  });
  const submitHandler: SubmitHandler<IInheritanceCaseCreateSchema> = (data) => {
    console.log(data);
  };

  const resetHandler = () => {
    router.back();
    console.log("reset");
  };

  useNavigationConfirmation(form.formState.isDirty);

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="20px">
      <Box
        component="form"
        width="100%"
        display="flex"
        flexDirection="column"
        gap="20px"
        onReset={resetHandler}
        onSubmit={form.handleSubmit(submitHandler)}
      >
        <CreateFormFields form={form} />
        <Button type="submit">{t("Save")}</Button>
      </Box>
    </Box>
  );
}
