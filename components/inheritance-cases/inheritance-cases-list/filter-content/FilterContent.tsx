import { Box, BoxProps } from "@mui/material";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  IInheritanceCasesListFilterFormFields,
  IInheritanceCasesListSearchBarForm,
} from "@/validator-schemas/inheritance-cases";
import SearchBarForm from "../../components/search-bar-form/SearchBarForm";
import { useTranslations } from "next-intl";
import SelectFormField from "../../components/form-fields/SelectFormField";
import { useFetchListParams } from "@/contexts/fetch-list-params";
import { InheritanceCasesFilterValuesProps } from "@/models/inheritance-cases";

interface IFilterContentProps extends BoxProps {}

const FilterContent = React.forwardRef<HTMLDivElement, IFilterContentProps>((props, ref) => {
  const { updateFilterValues, updateParams } = useFetchListParams<InheritanceCasesFilterValuesProps>();

  const t = useTranslations();
  const { className, ...rest } = props;
  const searchBarForm = useForm<IInheritanceCasesListSearchBarForm>();
  const filterFormFields = useForm<IInheritanceCasesListFilterFormFields>();
  const year = filterFormFields.watch("year");

  const searchBarFormSubmitHandler: SubmitHandler<IInheritanceCasesListSearchBarForm> = ({ keyWord }) => {
    if (!!keyWord) {
      updateFilterValues("keyWord", keyWord);
      updateParams("requestType", "search");
    } else {
      updateFilterValues("keyWord", "");
      updateParams("requestType", "fetch");
    }
  };

  const filterFormFieldsSubmitHandler: SubmitHandler<IInheritanceCasesListFilterFormFields> = ({ year }) => {
    if (!!year) updateFilterValues("year", year);
    else updateFilterValues("year", "");
  };

  const filterFormFieldsResetHandler = () => {
    filterFormFields.reset({ year: "" });
    updateFilterValues("year", "");
  };

  const searchBarFormResetHandler = () => {
    searchBarForm.reset({ keyWord: "" });
    updateFilterValues("keyWord", "");
    updateParams("requestType", "fetch");
  };

  useEffect(() => {
    const yearFieldState = filterFormFields.getFieldState("year");
    if (yearFieldState.isDirty && !!year) updateFilterValues("year", year);
    else updateFilterValues("year", "");
  }, [year]);

  return (
    <Box ref={ref} display="flex" flexDirection="column" gap="10px" {...rest}>
      <form onReset={searchBarFormResetHandler} onSubmit={searchBarForm.handleSubmit(searchBarFormSubmitHandler)}>
        <SearchBarForm form={searchBarForm} />
      </form>
      <form
        onReset={filterFormFieldsResetHandler}
        onSubmit={filterFormFields.handleSubmit(filterFormFieldsSubmitHandler)}
      >
        <Box display="flex" justifyContent="flex-end">
          <SelectFormField
            control={filterFormFields.control}
            name="year"
            defaultValue=""
            trigger={filterFormFields.trigger}
            props={{
              select: {
                data: [
                  { value: 2023, label: `2023 ${t("year")}` },
                  { value: 2022, label: `2022 ${t("year")}` },
                  { value: 2021, label: `2021 ${t("year")}` },
                ],
                sx: { width: "auto" },
              },
              wrapper: { width: "fit-content" },
            }}
          />
        </Box>
      </form>
    </Box>
  );
});

FilterContent.displayName = "FilterContent";
export default FilterContent;
