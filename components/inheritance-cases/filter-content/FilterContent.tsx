import { Box, BoxProps } from "@mui/material";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  IInheritanceCasesFilterFormFields,
  IInheritanceCasesSearchBarForm,
} from "@/validator-schemas/inheritance-cases";
import { useTranslations } from "next-intl";
import FilterFormFields from "./filter-form-fields/FilterFormFields";
import ContentTogller from "../ui/ContentTogller";
import SearchBarForm from "./search-bar-form/SearchBarForm";
import Button from "@/components/ui/Button";

interface IFilterContentProps extends BoxProps {
  onSearchBarFormSubmit?: SubmitHandler<IInheritanceCasesSearchBarForm>;
  onFilterFormFieldsSubmit?: SubmitHandler<IInheritanceCasesFilterFormFields>;
  onFilterFormFieldsReset?: SubmitHandler<IInheritanceCasesFilterFormFields>;
}

const FilterContent = React.forwardRef<HTMLDivElement, IFilterContentProps>((props, ref) => {
  const { className, onSearchBarFormSubmit, onFilterFormFieldsSubmit, onFilterFormFieldsReset, ...rest } = props;
  const t = useTranslations();
  const searchBarForm = useForm<IInheritanceCasesSearchBarForm>();
  const filterFormFields = useForm<IInheritanceCasesFilterFormFields>();

  const searchBarFormSubmitHandler: SubmitHandler<IInheritanceCasesSearchBarForm> = (data) => {
    onSearchBarFormSubmit && onSearchBarFormSubmit(data);
  };

  const filterFormFieldsSubmitHandler: SubmitHandler<IInheritanceCasesFilterFormFields> = (data) => {
    onFilterFormFieldsSubmit && onFilterFormFieldsSubmit(data);
  };

  const filterFormFieldsResetHandler = () => {
    filterFormFields.reset({ dateOfDeath: "", fullName: "", inheritanceCaseNumber: "", pin: "", year: "" });
    onFilterFormFieldsReset && onFilterFormFieldsReset(filterFormFields.getValues());
  };

  return (
    <Box ref={ref} display="flex" flexDirection="column" gap="10px" {...rest}>
      <form onSubmit={searchBarForm.handleSubmit(searchBarFormSubmitHandler)}>
        <SearchBarForm form={searchBarForm} />
      </form>

      <ContentTogller>
        <form
          onReset={filterFormFieldsResetHandler}
          onSubmit={filterFormFields.handleSubmit(filterFormFieldsSubmitHandler)}
        >
          <FilterFormFields form={filterFormFields} />
          <Box width="fit-content" display="flex" gap="10px">
            <Button type="submit">Применить</Button>
            <Button type="reset" disabled={!filterFormFields.formState.isDirty} buttonType="danger">
              Сбросить
            </Button>
          </Box>
        </form>
      </ContentTogller>
    </Box>
  );
});

FilterContent.displayName = "FilterContent";
export default FilterContent;
