import { Box } from "@mui/material";
import useNavigationConfirmation from "@/hooks/useNavigationConfirmation";
import useFetch from "@/hooks/useFetch";
import { Dispatch, SetStateAction } from "react";
import PersonalData from "@/components/fields/PersonalData";
import { UseFormReturn } from "react-hook-form";
import { getAddressNames, getPersonalDataNames } from "./lib/const";
import { isNewInheritanceCase } from "./lib/_requests";

interface FetchTundukDataProps {
  form: UseFormReturn<any>;
  setError: Dispatch<SetStateAction<{ message: string; link?: string }>>;
}

const skipFieldsNames = [
  getPersonalDataNames(0).pin,
  getPersonalDataNames(0).tundukDocumentNumber,
  getPersonalDataNames(0).tundukDocumentSeries,
];

const fieldsNames = [...Object.values(getPersonalDataNames(0)), ...Object.values(getAddressNames(0))];

export default function FetchTundukData({ form, setError }: FetchTundukDataProps) {
  const { update: update, loading: tundukPersonalDataLoading } = useFetch("", "POST");

  useNavigationConfirmation(form.formState.isDirty);

  const setParamsError = (field: any) => {
    form.setError(field, { message: "required" });
  };

  const handlePinCheckRequest = async () => {
    const pin = form.getValues("requester.0.personalNumber");
    const series = form.getValues("requester.0.passportSeries");
    const number = form.getValues("requester.0.passportNumber");

    const existedInheritanceCaseId = await isNewInheritanceCase(pin, update);
    if (existedInheritanceCaseId) {
      setError({
        message: "Such a inheritance case already exists",
        link: `/inheritance-cases/${existedInheritanceCaseId}`,
      });
      return;
    }

    let url = `person/${pin}`;
    if (!!series && !!number) url = `individual?pin=${pin}&series=${series}&number=${number}`;
    const response: Record<string, any> = await update(`/api/tunduk`, {
      model: `/ws/tunduk/${url}`,
    });

    const status = response?.status;
    if (status === 0) {
      const data = response?.data;
      if (data != null) {
        fieldsNames.map((field) => {
          const fieldPath = field.split(".");
          const fieldLastItem = fieldPath[fieldPath.length - 1];
          const value = data?.[fieldLastItem];
          // console.log(value);
          if (skipFieldsNames.includes(field)) return;
          if (value != null && (typeof value === typeof "" || fieldLastItem === "picture"))
            form.setValue(field as any, value);
        });
      }
    }

    if (status === -1) {
      const errorMessage = response?.data?.message;
      if (errorMessage) return setError({ message: errorMessage });
    }
  };

  const handlePinCheck = async () => {
    handlePinReset();
    const validates = skipFieldsNames.map((field: any) => {
      const value = form.getValues(field);
      if (!value) {
        setParamsError(field);
        return false;
      } else return true;
    });

    if (!validates.every((bool) => bool)) return;
    handlePinCheckRequest();
  };

  const resetForm = (fields: string[], skip: string[] = []) => {
    fields.map((field) => !skip.includes(field) && form.resetField(field as any));
  };

  const handlePinReset = async () => {
    resetForm(fieldsNames, skipFieldsNames);
    setError({ message: "" });
  };

  return (
    <Box>
      <PersonalData
        isTundukRequested
        loading={tundukPersonalDataLoading}
        form={form}
        names={getPersonalDataNames(0)}
        onPinCheck={() => handlePinCheck()}
        onPinReset={() => handlePinReset()}
        isRequester={true}
        slotProps={{
          image: {
            sx: { right: "25px", width: "80px", zIndex: 1, top: { xs: 0 }, height: "fit-content" },
          },
        }}
      />
    </Box>
  );
}
