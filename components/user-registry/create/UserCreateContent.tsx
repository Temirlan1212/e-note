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
            Роль пользователя
          </Typography>
          <Select data={roles} selectType="success" defaultValue={roles[1]} fullWidth />
        </Box>
        <Checkbox label="Иностранное лицо" />
      </Box>
      <Box
        // component=""
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
          Данные для выгрузки с портала “Тундук”
        </Typography>
        <Box sx={inputStyles}>
          <Typography>Фамилия</Typography>
          <Input
            fullWidth
            placeholder="Введите фамилию"
            name="lastName"
            color="success"
            // error={!!errors.lastName?.message ?? false}
            // helperText={errors.lastName?.message && t(errors.lastName?.message)}
            register={form.register}
          />
        </Box>
        <Box sx={inputStyles}>
          <Typography>Имя</Typography>
          <Input
            fullWidth
            placeholder="Введите имя"
            name="firstName"
            color="success"
            // error={!!errors.lastName?.message ?? false}
            // helperText={errors.lastName?.message && t(errors.lastName?.message)}
            register={form.register}
          />
        </Box>
        <Box sx={inputStyles}>
          <Typography>Отчество</Typography>
          <Input
            fullWidth
            placeholder="Введите отчество"
            name="middleName"
            color="success"
            // error={!!errors.lastName?.message ?? false}
            // helperText={errors.lastName?.message && t(errors.lastName?.message)}
            register={form.register}
          />
        </Box>
        <Box sx={inputStyles}>
          <Typography>Персональный номер (ИНН)</Typography>
          <Input
            fullWidth
            placeholder="Введите персональный номер (ИНН)"
            name="personalNumber"
            color="success"
            // error={!!errors.lastName?.message ?? false}
            // helperText={errors.lastName?.message && t(errors.lastName?.message)}
            register={form.register}
          />
        </Box>
      </Box>
      <Box
        sx={{
          maxHeight: isVisible ? "1000px" : 0,
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
          Проверить
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
              Паспортные данные действительны в базе данных “Тундук”
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#687C9B",
            }}
          >
            Контактные данные
          </Typography>
          <Box display="flex" flexDirection="column" gap="20px">
            <Box sx={inputStyles}>
              <Typography>E-mail*</Typography>
              <Input
                fullWidth
                placeholder="Введите фамилию"
                name="lastName"
                color="success"
                // error={!!errors.lastName?.message ?? false}
                // helperText={errors.lastName?.message && t(errors.lastName?.message)}
                register={form.register}
              />
            </Box>
            <Box sx={inputStyles}>
              <Typography>Номер телефона*</Typography>
              <Input
                fullWidth
                placeholder="Введите фамилию"
                name="lastName"
                color="success"
                // error={!!errors.lastName?.message ?? false}
                // helperText={errors.lastName?.message && t(errors.lastName?.message)}
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
          Зарегистрировать
        </Button>
      </Box>
    </Box>
  );
};

export default UserCreateContent;
