import { Box, BoxProps } from "@mui/material";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import DatePickerFormField from "../components/form-fields/DatePickerFormField";
import Address from "@/components/fields/Address";
import NotarySelection from "../../fields/NotarySelection";
import { getAddressNames } from "./lib/const";

interface ICreateFormProps extends BoxProps {
  form: UseFormReturn<any>;
}

const CreateFormFields = React.forwardRef<HTMLDivElement, ICreateFormProps>((props, ref) => {
  const { className, form, ...rest } = props;

  return (
    <Box ref={ref} {...rest}>
      <Box display="flex" flexDirection="column" gap="40px">
        <Box display="flex" flexDirection="column" gap="30px">
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
