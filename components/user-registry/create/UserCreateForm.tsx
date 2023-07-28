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

  const form = useForm<any>({
    // resolver: yupResolver<any>(),
  });

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
      // component=""
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
        Документ, удостоверяющий личность
      </Typography>
      <Box sx={inputStyles}>
        <Typography>Наименование</Typography>
        <Select data={roles} selectType="success" defaultValue={roles[1]} fullWidth />
      </Box>
      <Box sx={inputStyles}>
        <Typography>Серия и № паспорта*</Typography>
        <Box
          sx={{
            display: "flex",
            gap: "50px",
            alignItems: "center",
          }}
        >
          <Select data={roles} selectType="success" defaultValue={roles[1]} />
          <Input
            fullWidth
            placeholder="Введите cерия и № паспорта"
            name="middleName"
            color="success"
            // error={!!errors.lastName?.message ?? false}
            // helperText={errors.lastName?.message && t(errors.lastName?.message)}
            register={form.register}
          />
        </Box>
      </Box>
      <Box sx={inputStyles}>
        <Typography>Орган и дата выдачи</Typography>
        <Box
          sx={{
            display: "flex",
            gap: "15px",
            alignItems: "center",
          }}
        >
          <Input
            fullWidth
            placeholder="Введите орган выдачи"
            name="middleName"
            color="success"
            // error={!!errors.lastName?.message ?? false}
            // helperText={errors.lastName?.message && t(errors.lastName?.message)}
            register={form.register}
          />
          <Input
            fullWidth
            placeholder="Введите орган выдачи"
            name="middleName"
            color="success"
            // error={!!errors.lastName?.message ?? false}
            // helperText={errors.lastName?.message && t(errors.lastName?.message)}
            register={form.register}
          />
          <Typography>от</Typography>
          <DatePicker onChange={handleDateChange} value={date} width="350px" />
        </Box>
      </Box>
      <Typography
        sx={{
          fontSize: "18px",
          fontWeight: "600",
          color: "#687C9B",
        }}
      >
        Адрес прописки (регистрации)
      </Typography>
      <Box sx={inputStyles}>
        <Typography>Область</Typography>
        <Select data={roles} selectType="success" defaultValue={roles[1]} fullWidth />
      </Box>
      <Box sx={inputStyles}>
        <Typography>Район</Typography>
        <Select data={roles} selectType="success" defaultValue={roles[1]} fullWidth />
      </Box>
      <Box sx={inputStyles}>
        <Typography>Населенный пункт, город</Typography>
        <Select data={roles} selectType="success" defaultValue={roles[1]} fullWidth />
      </Box>
      <Box sx={inputStyles}>
        <Typography>Улица</Typography>
        <Input
          fullWidth
          placeholder="Введите улицу"
          name="middleName"
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
          <Typography>Дом</Typography>
          <Input
            fullWidth
            placeholder="Введите cерия и № паспорта"
            name="middleName"
            color="success"
            // error={!!errors.lastName?.message ?? false}
            // helperText={errors.lastName?.message && t(errors.lastName?.message)}
            register={form.register}
          />
        </Box>
        <Box sx={inputStyles} width="100%">
          <Typography>Квартира</Typography>
          <Input
            fullWidth
            placeholder="Введите cерия и № паспорта"
            name="middleName"
            color="success"
            // error={!!errors.lastName?.message ?? false}
            // helperText={errors.lastName?.message && t(errors.lastName?.message)}
            register={form.register}
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
        Адрес фактического места жительства
      </Typography>
      <Box sx={inputStyles}>
        <Typography>Область</Typography>
        <Select data={roles} selectType="success" defaultValue={roles[1]} fullWidth />
      </Box>
      <Box sx={inputStyles}>
        <Typography>Район</Typography>
        <Select data={roles} selectType="success" defaultValue={roles[1]} fullWidth />
      </Box>
      <Box sx={inputStyles}>
        <Typography>Населенный пункт, город</Typography>
        <Select data={roles} selectType="success" defaultValue={roles[1]} fullWidth />
      </Box>
      <Box sx={inputStyles}>
        <Typography>Улица</Typography>
        <Input
          fullWidth
          placeholder="Введите улицу"
          name="middleName"
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
          <Typography>Дом</Typography>
          <Input
            fullWidth
            placeholder="Введите cерия и № паспорта"
            name="middleName"
            color="success"
            // error={!!errors.lastName?.message ?? false}
            // helperText={errors.lastName?.message && t(errors.lastName?.message)}
            register={form.register}
          />
        </Box>
        <Box sx={inputStyles} width="100%">
          <Typography>Квартира</Typography>
          <Input
            fullWidth
            placeholder="Введите cерия и № паспорта"
            name="middleName"
            color="success"
            // error={!!errors.lastName?.message ?? false}
            // helperText={errors.lastName?.message && t(errors.lastName?.message)}
            register={form.register}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default UserCreateForm;
