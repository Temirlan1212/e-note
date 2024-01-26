import { Box, BoxProps, Typography } from "@mui/material";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import PersonalData from "@/components/fields/PersonalData";
import DatePickerFormField from "../components/form-fields/DatePickerFormField";
import Address from "@/components/fields/Address";
import NotarySelection from "../../fields/NotarySelection";
import Button from "@/components/ui/Button";
import { useRouter } from "next/router";

interface ICreateFormProps extends BoxProps {
  form: UseFormReturn<any>;
}

const getPersonalDataNames = (index: number) => ({
  lastName: `requester.${index}.lastName`,
  firstName: `requester.${index}.firstName`,
  name: `requester.${index}.name`,
  middleName: `requester.${index}.middleName`,
  pin: `requester.${index}.personalNumber`,
});

const getAddressNames = (index: number) => ({
  region: `requester.${index}.mainAddress.region`,
  district: `requester.${index}.mainAddress.district`,
  city: `requester.${index}.mainAddress.city`,
  street: `requester.${index}.mainAddress.addressL4`,
  house: `requester.${index}.mainAddress.addressL3`,
  apartment: `requester.${index}.mainAddress.addressL2`,
  foreignAddress: `requester.${index}.foreignAddress`,
});

const CreateFormFields = React.forwardRef<HTMLDivElement, ICreateFormProps>((props, ref) => {
  const t = useTranslations();
  const { className, form, ...rest } = props;

  return (
    <Box ref={ref} {...rest}>
      <Box display="flex" flexDirection="column" gap="40px">
        <Box display="flex" flexDirection="column" gap="30px">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">Создать наследственное дело</Typography>
            <Button sx={{ width: "fit-content" }} type="reset" buttonType="secondary">
              {t("Back")}
            </Button>
          </Box>

          <PersonalData form={form} names={getPersonalDataNames(0)} />
          <Box display="flex" gap="20px">
            <DatePickerFormField
              control={form.control}
              trigger={form.trigger}
              name="requester.0.birthDate"
              label="Birth date"
            />
            <DatePickerFormField
              control={form.control}
              trigger={form.trigger}
              name="requester.0.deathDate"
              label="Date of death"
            />
          </Box>

          <Address
            form={form}
            names={getAddressNames(0)}
            sx={{
              boxSx: { gap: "10px !important" },
              labelsSx: { fontWeight: 600 },
              inputSx: { ".MuiInputBase-root": { fontWeight: 500 } },
            }}
          />
        </Box>

        <NotarySelection form={form} />
      </Box>
    </Box>
  );
});

CreateFormFields.displayName = "CreateFormFields";
export default CreateFormFields;
