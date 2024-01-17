import { Box, BoxProps } from "@mui/material";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { IInheritanceCasesFilterForm } from "@/validator-schemas/inheritance-cases";
import { useTranslations } from "next-intl";
import FilterFormFields from "./filter-form-fields/FilterFormFields";
import ContentTogller from "../ui/ContentTogller";

const FilterContent = React.forwardRef<HTMLDivElement, BoxProps & { form: UseFormReturn<IInheritanceCasesFilterForm> }>(
  ({ className, form, ...props }, ref) => {
    const t = useTranslations();

    return (
      <Box ref={ref} display="flex" flexDirection="column" gap="10px" {...props}>
        <ContentTogller>
          <FilterFormFields form={form} />
        </ContentTogller>
      </Box>
    );
  }
);

FilterContent.displayName = "FilterContent";
export default FilterContent;
