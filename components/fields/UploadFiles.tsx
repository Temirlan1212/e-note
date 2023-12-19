import { Controller, UseFormReturn, useFieldArray, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { yupResolver } from "@hookform/resolvers/yup";
import { IFilesSchema, filesSchema } from "@/validator-schemas/files";
import { InputLabel, Box } from "@mui/material";
import FileInput from "@/components/ui/FileInput";
import Button from "@/components/ui/Button";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import useEffectOnce from "@/hooks/useEffectOnce";

export interface IControllerListItem {
  index: number;
  getElement: (isLastItem: boolean) => JSX.Element;
}

export interface IUploadFilesProps {
  onUpload?: () => void;
  form?: UseFormReturn<any>;
  name?: null | string;
}

export default function UploadFiles(props: IUploadFilesProps) {
  const { onUpload, name } = props;
  const t = useTranslations();

  const form = useForm<IFilesSchema>({
    mode: "onTouched",
    resolver: yupResolver<IFilesSchema>(filesSchema),
  });

  const { control } = props.form ?? form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: name ?? "files",
  });

  useEffectOnce(() => {
    if (fields.length < 1) {
      append({ file: undefined });
    }
  });

  const handleRemoveClick = (index: number) => {
    remove(index);
  };

  const handleAddClick = () => {
    append({ file: undefined });
  };

  const isLastField = (index: number) => fields.length - 1 === index;

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      {fields.map((field, index) => (
        <Controller
          key={field.id}
          control={control}
          name={`${name ?? "files"}.${index}.file`}
          render={({ field, fieldState }) => (
            <Box display="flex" alignItems="end" gap="20px">
              <Box display="flex" flexDirection="column" width="100%">
                <InputLabel sx={{ fontWeight: 600 }}>{t("File")}</InputLabel>
                <FileInput
                  sx={{ ".MuiInputBase-root": { fontWeight: 500 } }}
                  inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                  helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  {...field}
                />
              </Box>
              <Button
                buttonType={isLastField(index) ? "primary" : "secondary"}
                sx={{ flex: 0, minWidth: "auto", padding: "10px" }}
                onClick={() => (isLastField(index) ? handleAddClick() : handleRemoveClick(index))}
              >
                {isLastField(index) ? <AddIcon /> : <RemoveIcon />}
              </Button>
            </Box>
          )}
        />
      ))}
    </Box>
  );
}
