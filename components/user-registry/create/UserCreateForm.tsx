import { FC, useState } from "react";

import { useTranslations } from "next-intl";
import { Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import { format, parse } from "date-fns";

interface IUserCreateFormProps {}

const roles = [
  {
    value: "1",
    label: "Пользователь",
  },
  {
    value: "2",
    label: "Нотариус",
  },
];

const UserCreateForm: FC<IUserCreateFormProps> = (props) => {
  const [date, setDate] = useState<string | null>(null);

  const form = useForm<any>();

  const t = useTranslations();

  const handleDateChange = (from: string) => {
    const parsedDate = parse(from, "yyyy-MM-dd", new Date());

    if (!isNaN(parsedDate.getTime())) {
      setDate(format(parsedDate, "yyyy-MM-dd"));
    } else {
      setDate(null);
    }
  };

  const {
    formState: { errors },
    setError,
    reset,
  } = form;

  const inputStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    ".MuiInputBase-input": { padding: "12px 14px", fontSize: "14px" },
  };
  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <Typography
        sx={{
          fontSize: "18px",
          fontWeight: "600",
          color: "#687C9B",
        }}
      >
        {t("IdentityDocument")}
      </Typography>
      <Box sx={inputStyles}>
        <Typography> {t("DocumentName")}</Typography>
        <Select data={roles} selectType="success" defaultValue={roles[1]} fullWidth />
      </Box>
      <Box sx={inputStyles}>
        <Typography> {t("PassportSeriesNumber")}</Typography>
        <Box
          sx={{
            display: "flex",
            gap: "50px",
            alignItems: "center",
          }}
        >
          <Select
            data={roles}
            selectType="success"
            defaultValue={roles[1]}
            sx={{
              minWidth: {
                xs: "120px",
                sm: "145px",
              },
              height: "44px",
              borderRadius: "0",
            }}
          />
          <Input fullWidth placeholder={t("EnterPassportSeriesNumber")} color="success" register={form.register} />
        </Box>
      </Box>
      <Box sx={inputStyles}>
        <Typography> {t("IssuingAuthorityDate")}</Typography>
        <Box
          sx={{
            display: "flex",
            gap: "15px",
            alignItems: "center",
          }}
        >
          <Input fullWidth placeholder={t("EnterIssuingAuthority")} color="success" register={form.register} />
          <Input fullWidth placeholder={t("EnterIssuingAuthority")} color="success" register={form.register} />
          <Typography>от</Typography>
          <DatePicker
            onChange={handleDateChange}
            value={date}
            sx={{
              width: {
                xs: "100%",
                md: "350px",
              },
            }}
            placeholder="__/__/____"
          />
        </Box>
      </Box>
      <Typography
        sx={{
          fontSize: "18px",
          fontWeight: "600",
          color: "#687C9B",
        }}
      >
        {t("RegistrationAddress")}
      </Typography>
      <Box sx={inputStyles}>
        <Typography>{t("Region")}</Typography>
        <Select data={roles} selectType="success" defaultValue={roles[1]} fullWidth />
      </Box>
      <Box sx={inputStyles}>
        <Typography>{t("District")}</Typography>
        <Select data={roles} selectType="success" defaultValue={roles[1]} fullWidth />
      </Box>
      <Box sx={inputStyles}>
        <Typography>{t("LocalityCity")}</Typography>
        <Select data={roles} selectType="success" defaultValue={roles[1]} fullWidth />
      </Box>
      <Box sx={inputStyles}>
        <Typography>{t("Street")}</Typography>
        <Input
          fullWidth
          placeholder={t("EnterStreet")}
          color="success"
          // error={!!errors.lastName?.message ?? false}
          // helperText={errors.lastName?.message && t(errors.lastName?.message)}
          register={form.register}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "50px",
          alignItems: "center",
        }}
      >
        <Box sx={inputStyles} width="100%">
          <Typography>{t("HouseNumber")}</Typography>
          <Input fullWidth placeholder={t("EnterHouseNumber")} color="success" register={form.register} />
        </Box>
        <Box sx={inputStyles} width="100%">
          <Typography>{t("ApartmentNumber")}</Typography>
          <Input fullWidth placeholder={t("ApartmentNumber")} color="success" register={form.register} />
        </Box>
      </Box>
      <Typography
        sx={{
          fontSize: "18px",
          fontWeight: "600",
          color: "#687C9B",
        }}
      >
        {t("ActualResidenceAddress")}
      </Typography>
      <Box sx={inputStyles}>
        <Typography>{t("Region")}</Typography>
        <Select data={roles} selectType="success" defaultValue={roles[1]} fullWidth />
      </Box>
      <Box sx={inputStyles}>
        <Typography>{t("District")}</Typography>
        <Select data={roles} selectType="success" defaultValue={roles[1]} fullWidth />
      </Box>
      <Box sx={inputStyles}>
        <Typography>{t("LocalityCity")}</Typography>
        <Select data={roles} selectType="success" defaultValue={roles[1]} fullWidth />
      </Box>
      <Box sx={inputStyles}>
        <Typography>{t("Street")}</Typography>
        <Input
          fullWidth
          placeholder={t("EnterStreet")}
          color="success"
          // error={!!errors.lastName?.message ?? false}
          // helperText={errors.lastName?.message && t(errors.lastName?.message)}
          register={form.register}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "50px",
          alignItems: "center",
        }}
      >
        <Box sx={inputStyles} width="100%">
          <Typography>{t("HouseNumber")}</Typography>
          <Input fullWidth placeholder={t("EnterHouseNumber")} color="success" register={form.register} />
        </Box>
        <Box sx={inputStyles} width="100%">
          <Typography>{t("ApartmentNumber")}</Typography>
          <Input fullWidth placeholder={t("ApartmentNumber")} color="success" register={form.register} />
        </Box>
      </Box>
    </Box>
  );
};

export default UserCreateForm;
