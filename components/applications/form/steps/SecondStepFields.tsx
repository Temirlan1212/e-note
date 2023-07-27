import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import { IApplication } from "@/models/applications/application";
import Box from "@mui/material/Box";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Hint from "@/components/ui/Hint";
import { InputLabel } from "@mui/material";
import { useRouter } from "next/router";

export interface IStepFieldsProps {
  form: UseFormReturn<IApplication>;
  onPrev?: Function | null;
  onNext?: Function | null;
}
const objectData = [
  {
    order_seq: 2,
    title_kg: "Сатып алуу жана өндүрүү",
    title_en: "Buy and produce",
    title_ru: "Покупать и производить",
    title: "Buy and produce",
    value: "buyAndProduce",
    id: 1,
  },
  {
    order_seq: 1,
    title_kg: "Өндүрүү",
    title_en: "Produce",
    title_ru: "Производить",
    title: "Produce",
    value: "produce",
    id: 2,
  },
  {
    order_seq: 0,
    title_kg: "Сатып алуу",
    title_en: "Buy",
    title_ru: "Купить",
    title: "Buy",
    value: "buy",
    id: 3,
  },
];

const objectTypeData = [
  {
    order_seq: 8,
    title_ru: "All properties owned",
    title_kg: "All properties owned",
    title_en: "All properties owned",
    title: "All properties owned",
    value: "10",
    "object.id": 1,
  },
  {
    order_seq: 7,
    title_ru: "Other rights",
    title_kg: "Other rights",
    title_en: "Other rights",
    title: "Other rights",
    value: "9",
    "object.id": 1,
  },
  {
    order_seq: 6,
    title_ru: "Parents,spouses,kids",
    title_kg: "Parents,spouses,kids",
    title_en: "Parents,spouses,kids",
    title: "Parents,spouses,kids",
    value: "7",
    "object.id": 1,
  },
  {
    order_seq: 5,
    title_ru: "Documents",
    title_kg: "Documents",
    title_en: "Documents",
    title: "Documents",
    value: "6",
    "object.id": 2,
  },
  {
    order_seq: 4,
    title_ru: "State registration of immovable property",
    title_kg: "State registration of immovable property",
    title_en: "State registration of immovable property",
    title: "State registration of immovable property",
    value: "5",
    "object.id": 2,
  },
  {
    order_seq: 3,
    title_ru: "Securities(shares,bill of exchange,bond,bank checks,certificate,bill of lading,etc)",
    title_kg: "Securities(shares,bill of exchange,bond,bank checks,certificate,bill of lading,etc)",
    title_en: "Securities(shares,bill of exchange,bond,bank checks,certificate,bill of lading,etc)",
    title: "Securities(shares,bill of exchange,bond,bank checks,certificate,bill of lading,etc)",
    value: "4",
    "object.id": 2,
  },
  {
    order_seq: 2,
    title_ru: "Money,Accounts,Share in authorized capital,Property rights,etc.",
    title_kg: "Money,Accounts,Share in authorized capital,Property rights,etc.",
    title_en: "Money,Accounts,Share in authorized capital,Property rights,etc.",
    title: "Money,Accounts,Share in authorized capital,Property rights,etc.",
    value: "3",
    "object.id": 3,
  },
  {
    order_seq: 1,
    title_ru: "Transport vehicle",
    title_kg: "Transport vehicle",
    title_en: "Transport vehicle",
    title: "Transport vehicle",
    value: "2",
    "object.id": 3,
  },
  {
    order_seq: 0,
    title_ru: "House,Apartment,Premise,Land plot",
    title_kg: "House,Apartment,Premise,Land plot",
    title_en: "House,Apartment,Premise,Land plot",
    title: "House,Apartment,Premise,Land plot",
    value: "1",
    "object.id": 3,
  },
];

export default function SecondStepFields({ form, onNext, onPrev }: IStepFieldsProps) {
  const t = useTranslations();
  const { locale } = useRouter();
  const { trigger, control, watch, resetField } = form;

  const stepNameList: (keyof IApplication)[] = ["object", "objectType"];

  const objectId = watch("object");

  const objectTypeFilteredData = useMemo(() => {
    return objectTypeData.filter((item) => item["object.id"] === objectId);
  }, [objectId]);

  const handlePrevClick = () => {
    if (onPrev != null) onPrev();
  };

  const handleNextClick = async () => {
    const validated = await trigger(stepNameList);
    if (onNext != null && validated) onNext();
  };

  return (
    <Box display="flex" flexDirection="column" gap="30px">
      <Controller
        control={control}
        name="object"
        defaultValue={null}
        render={({ field, fieldState }) => (
          <Box width="100%" display="flex" flexDirection="column" gap="10px">
            <Box display="flex" flexWrap="wrap" justifyContent="space-between" gap="10px 20px" alignItems="end">
              <InputLabel>{t("Object")}</InputLabel>
              <Hint type="hint" maxWidth="520px">
                {t("second-step-hint-title")}
              </Hint>
            </Box>

            <Select
              fullWidth
              selectType={fieldState.error?.message ? "danger" : field.value ? "success" : "secondary"}
              data={objectData ?? []}
              labelField={"title_" + locale}
              valueField="id"
              helperText={fieldState.error?.message}
              {...field}
              onChange={(...event: any[]) => {
                resetField("objectType");
                field.onChange(...event);
                trigger("object");
              }}
            />
          </Box>
        )}
      />

      <Controller
        control={control}
        name="objectType"
        defaultValue={null}
        render={({ field, fieldState }) => (
          <Box width="100%" display="flex" flexDirection="column" gap="10px">
            <InputLabel>{t("Object type")}</InputLabel>
            <Select
              disabled={objectTypeFilteredData.length < 1}
              selectType={fieldState.error?.message ? "danger" : field.value ? "success" : "secondary"}
              data={objectTypeFilteredData}
              labelField={"title_" + locale}
              valueField="value"
              helperText={fieldState.error?.message}
              {...field}
              onChange={(...event: any[]) => {
                field.onChange(...event);
                trigger("objectType");
              }}
            />
          </Box>
        )}
      />

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        {onPrev != null && (
          <Button onClick={handlePrevClick} startIcon={<ArrowBackIcon />}>
            {t("Prev")}
          </Button>
        )}
        {onNext != null && (
          <Button onClick={handleNextClick} endIcon={<ArrowForwardIcon />}>
            {t("Next")}
          </Button>
        )}
      </Box>
    </Box>
  );
}
