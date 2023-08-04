import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { IFilesSchema, filesSchema } from "@/validator-schemas/files";
import { InputLabel, Box } from "@mui/material";
import FileInput from "@/components/ui/FileInput";
import Button from "@/components/ui/Button";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export interface IControllerListItem {
  index: number;
  getElement: (isLastItem: boolean) => JSX.Element;
}

export interface IUploadFilesProps {
  onUpload?: () => void;
}

export default function UploadFiles({ onUpload }: IUploadFilesProps) {
  const t = useTranslations();

  const form = useForm<IFilesSchema>({
    mode: "onTouched",
    resolver: yupResolver<IFilesSchema>(filesSchema),
  });

  const { trigger, control, watch, resetField } = form;

  const [controllers, setControllers] = useState<IControllerListItem[]>([
    {
      index: 0,
      getElement(isLastItem = true) {
        const index = this.index;
        return (
          <Controller
            control={control}
            name={`files.${index}.file`}
            render={({ field, fieldState }) => (
              <Box display="flex" alignItems="end" gap="20px">
                <Box display="flex" flexDirection="column" width="100%">
                  <InputLabel>{t("File")}</InputLabel>
                  <FileInput
                    inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                    helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                  />
                </Box>
                <Button
                  buttonType={isLastItem ? "primary" : "secondary"}
                  sx={{ flex: 0, minWidth: "auto", padding: "10px" }}
                  onClick={() => (isLastItem ? handleAddClick() : handleRemoveClick(index))}
                >
                  {isLastItem ? <AddIcon /> : <RemoveIcon />}
                </Button>
              </Box>
            )}
          />
        );
      },
    },
  ]);

  const handleRemoveClick = (index: number) => {
    setControllers((prev) => {
      const filteredControllers = prev.filter((controller: IControllerListItem) => index != controller.index);

      return [...filteredControllers];
    });
  };

  const handleAddClick = () => {
    setControllers((prev) => {
      const lastItem = prev[prev.length - 1];

      if (lastItem == null) return [...prev];

      const newItem = { ...lastItem, index: lastItem.index + 1 };

      return [...prev, newItem];
    });
  };

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      {controllers.map((controller, index) => (
        <Box key={controller.index}>{controller.getElement(index === controllers.length - 1)}</Box>
      ))}
    </Box>
  );
}
