import { Box, BoxProps } from "@mui/material";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IInheritanceCasesListSearchBarForm } from "@/validator-schemas/inheritance-cases";
import SearchBarForm from "../../components/search-bar-form/SearchBarForm";
import { useFetchListParams } from "@/contexts/fetch-list-params";
import { IHeirListFilterFormFields } from "@/validator-schemas/heir";

interface IFilterContentProps extends BoxProps {}

const FilterContent = React.forwardRef<HTMLDivElement, IFilterContentProps>((props, ref) => {
  const { updateFilterValues, updateParams } = useFetchListParams<IHeirListFilterFormFields>();

  const { className, ...rest } = props;
  const searchBarForm = useForm<IInheritanceCasesListSearchBarForm>();

  const searchBarFormSubmitHandler: SubmitHandler<IInheritanceCasesListSearchBarForm> = ({ keyWord }) => {
    if (!!keyWord) {
      updateFilterValues("keyWord", keyWord);
      updateParams("requestType", "search");
    } else {
      updateFilterValues("keyWord", "");
      updateParams("requestType", "fetch");
    }
  };

  const searchBarFormResetHandler = () => {
    searchBarForm.reset({ keyWord: "" });
    updateFilterValues("keyWord", "");
    updateParams("requestType", "fetch");
  };

  return (
    <Box ref={ref} display="flex" flexDirection="column" gap="10px" {...rest}>
      <form onReset={searchBarFormResetHandler} onSubmit={searchBarForm.handleSubmit(searchBarFormSubmitHandler)}>
        <SearchBarForm form={searchBarForm} />
      </form>
    </Box>
  );
});

FilterContent.displayName = "FilterContent";
export default FilterContent;
