import { SearchOutlined } from "@mui/icons-material";
import { Box, Container, FormControl, InputLabel, Typography, useMediaQuery } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { IHeir } from "@/models/profile/user";
import { yupResolver } from "@hookform/resolvers/yup";
import { heir as heirSchema } from "@/validator-schemas/schemas";

type Props = {};

const SearchForm = (props: Props) => {
  const t = useTranslations();

  const form = useForm<IHeir>({
    resolver: yupResolver(heirSchema),
  });

  const matches = useMediaQuery("(min-width:900px)");

  const {
    formState: { errors },
    reset,
  } = form;

  const ErrorMessageUser = t("The name of the testator has not been entered");
  const ErrorMessageINN = t("The testator's INN has not been entered");

  const onSubmit = async (data: IHeir) => {
    alert(`ФИО: ${data.username} ИНН:${data.innNumber}`);
    reset();
  };
  return (
    <Box sx={{ marginTop: "50px" }}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: matches ? "row" : "column",
          gap: matches ? "40px" : "30px",
        }}
      >
        <FormControl sx={{ width: "100%" }}>
          <InputLabel
            sx={{ color: "#24334B", fontSize: "18px", top: "-16px", left: "-14px", fontWeight: "500" }}
            shrink
          >
            {t("Full name of the testator (required)")}
          </InputLabel>
          <Input
            placeholder={t("Enter your full name")}
            fullWidth
            error={!!errors.username?.message ?? false}
            helperText={errors.username?.message && ErrorMessageUser}
            register={form.register}
            name="username"
          />
        </FormControl>
        <FormControl sx={{ width: "100%" }}>
          <InputLabel
            sx={{ color: "#24334B", fontSize: "18px", top: "-16px", left: "-14px", fontWeight: "500" }}
            shrink
          >
            {t("Testator's INN")}
          </InputLabel>
          <Input
            placeholder={t("Enter INN")}
            fullWidth
            error={!!errors.innNumber?.message ?? false}
            helperText={errors.innNumber?.message && ErrorMessageINN}
            register={form.register}
            name="innNumber"
          />
        </FormControl>
        <Button startIcon={<SearchOutlined />} type="submit" sx={{ width: "100%", height: "56px" }}>
          {t("Search")}
        </Button>
      </form>
    </Box>
  );
};

export default SearchForm;
