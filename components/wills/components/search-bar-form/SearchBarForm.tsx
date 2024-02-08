import { Box, BoxProps, Grid } from "@mui/material";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { IInheritanceCasesListSearchBarForm } from "@/validator-schemas/inheritance-cases";
import { useTranslations } from "next-intl";
import SearchBar from "@/components/ui/SearchBar";
import Button from "@/components/ui/Button";

const SearchBarForm = React.forwardRef<
  HTMLDivElement,
  BoxProps & { form: UseFormReturn<IInheritanceCasesListSearchBarForm> }
>(({ className, form, ...props }, ref) => {
  const t = useTranslations();

  return (
    <Box ref={ref} display="flex" flexDirection="column" gap="10px" {...props}>
      <Grid
        container
        spacing={{ xs: 2.5, sm: 3.75, md: 3.75 }}
        justifyContent="space-between"
        sx={{
          display: { xs: "flex", sm: "flex" },
          flexDirection: { xs: "column-reverse", sm: "column", md: "unset" },
          alignItems: { xs: "unset", sm: "flex-end", md: "unset" },
        }}
      >
        <Grid item xs={12} sm={12} md={9} sx={{ alignSelf: "stretch" }}>
          <SearchBar name="keyWord" register={form.register} showCloseButton />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="outlined"
            color="success"
            type="button"
            sx={{
              height: "auto",
              gap: "10px",
              fontSize: "14px",
              padding: "10px 22px",
              width: { xs: "100%" },
              "&:hover": { color: "#F6F6F6" },
            }}
            fullWidth
          >
            {t("Export to excel")}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
});

SearchBarForm.displayName = "SearchBarForm";
export default SearchBarForm;
