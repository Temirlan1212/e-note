import { FC, useState } from "react";

import { Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { yupResolver } from "@hookform/resolvers/yup";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import { CheckCircle } from "@mui/icons-material";

import Checkbox from "@/components/ui/Checkbox";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import UserCreateForm from "./UserCreateForm";

interface IUserCreateContentProps {}

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

const UserCreateContent: FC<IUserCreateContentProps> = (props) => {
  const form = useForm<any>({
    // resolver: yupResolver<any>(),
  });

  const t = useTranslations();

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
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
    ".MuiInputBase-input": { padding: "10px 14px" },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            ".MuiFormControl-root": {
              width: "100%",
            },
          }}
        >
          <Typography
            sx={{
              marginBottom: "5px",
            }}
          >
            {t("User role")}
          </Typography>
          <Select data={roles} selectType="success" defaultValue={roles[1]} fullWidth />
        </Box>
        <Checkbox label={t("Foreign person")} />
      </Box>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#687C9B",
          }}
        >
          {t("DataFromTundukPortal")}
        </Typography>
        <Box sx={inputStyles}>
          <Typography> {t("Surname")}</Typography>
          <Input
            fullWidth
            placeholder={t("EnterSurname")}
            name="lastName"
            color="success"
            // error={!!errors.lastName?.message ?? false}
            // helperText={errors.lastName?.message && t(errors.lastName?.message)}
            register={form.register}
          />
        </Box>
        <Box sx={inputStyles}>
          <Typography> {t("FirstName")}</Typography>
          <Input
            fullWidth
            placeholder={t("EnterFirstName")}
            name="firstName"
            color="success"
            // error={!!errors.firstName?.message ?? false}
            // helperText={errors.firstName?.message && t(errors.firstName?.message)}
            register={form.register}
          />
        </Box>
        <Box sx={inputStyles}>
          <Typography>{t("Patronymic")}</Typography>
          <Input
            fullWidth
            placeholder={t("EnterPatronymic")}
            name="middleName"
            color="success"
            // error={!!errors.middleName?.message ?? false}
            // helperText={errors.middleName?.message && t(errors.middleName?.message)}
            register={form.register}
          />
        </Box>
        <Box sx={inputStyles}>
          <Typography>{t("PersonalID")}</Typography>
          <Input
            fullWidth
            placeholder={t("EnterPersonalID")}
            name="personalNumber"
            color="success"
            // error={!!errors.personalNumber?.message ?? false}
            // helperText={errors.personalNumber?.message && t(errors.personalNumber?.message)}
            register={form.register}
          />
        </Box>
      </Box>
      <Box
        sx={{
          maxHeight: isVisible ? "1400px" : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease-out",
        }}
      >
        <UserCreateForm />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }}
      >
        <Button
          buttonType="secondary"
          endIcon={<ContentPasteSearchIcon />}
          onClick={toggleVisibility}
          sx={{
            padding: "10px 16px",
          }}
        >
          {t("Check")}
        </Button>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxHeight: isVisible ? "1000px" : 0,
            overflow: "hidden",
            transition: "max-height 0.3s ease-out",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "8px",
            }}
          >
            <CheckCircle sx={{ color: "success.main" }} />
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#687C9B",
              }}
            >
              {t("PassportDataValid")}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#687C9B",
            }}
          >
            {t("ContactInformation")}
          </Typography>
          <Box display="flex" flexDirection="column" gap="20px">
            <Box sx={inputStyles}>
              <Typography>E-mail*</Typography>
              <Input
                fullWidth
                placeholder={t("EnterEmail")}
                name="email"
                color="success"
                // error={!!errors.email?.message ?? false}
                // helperText={errors.email?.message && t(errors.email?.message)}
                register={form.register}
              />
            </Box>
            <Box sx={inputStyles}>
              <Typography>{t("PhoneNumber")}</Typography>
              <Input
                fullWidth
                placeholder={t("EnterPhoneNumber")}
                name="phoneNumber"
                color="success"
                // error={!!errors.phoneNumber?.message ?? false}
                // helperText={errors.phoneNumber?.message && t(errors.phoneNumber?.message)}
                register={form.register}
              />
            </Box>
          </Box>
        </Box>
        <Button
          color="success"
          buttonType="primary"
          sx={{
            padding: "8px 16px",
          }}
        >
          {t("Register")}
        </Button>
      </Box>
    </Box>
  );
};

export default UserCreateContent;
