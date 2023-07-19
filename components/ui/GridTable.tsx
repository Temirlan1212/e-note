import * as React from "react";
import {
  DataGrid,
  GridRowsProp,
  GridColumnHeaderParams,
  GridColDef,
  DataGridProps,
  GridValidRowModel,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Box, FormGroup, MenuItem, Typography } from "@mui/material";
import Menu from "@mui/material/Menu";
import Checkbox from "./Checkbox";
import { useForm } from "react-hook-form";
import Button from "./Button";
import { useTranslations } from "next-intl";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Badge from "@mui/material/Badge";

export interface IGridTableFilterItem {
  label: string;
  outputField: string;
}

export interface IFilterSubmitParams {
  value: Record<string, any>;
  rowParams: GridColumnHeaderParams<GridValidRowModel, any, any>;
}

export interface IGridTableProps extends DataGridProps {
  filterData?: Record<string, IGridTableFilterItem[]>;
  rows: GridRowsProp;
  columns: GridColDef[];
  onFilterSubmit?: (v: IFilterSubmitParams) => void;
}

export interface IGridTableHeaderProps {
  rowParams: GridColumnHeaderParams;
  filterData?: IGridTableFilterItem[];
  onFilterSubmit?: (v: IFilterSubmitParams) => void;
}

export const GridTable: React.FC<IGridTableProps> = ({ columns, rows, filterData, onFilterSubmit, sx, ...rest }) => {
  const t = useTranslations();
  const rootStyles = {
    ".MuiDataGrid-cell": {
      borderBottom: "none",
      color: "text.primary",
      fontWeight: "500",
    },
    ".MuiDataGrid-row": {
      border: "1px solid transparent",
      "&:hover": {
        backgroundColor: "#fff",
        border: "1px solid #CDCDCD",
      },
    },
    ".MuiDataGrid-columnHeaders": {
      border: "1px solid #CDCDCD",
      padding: "0 10px",
    },
    ".css-yrdy0g-MuiDataGrid-columnHeaderRow": {
      justifyContent: "space-between",
      width: "100%",
    },
    ".MuiDataGrid-columnHeadersInner": {
      width: "100%",
    },
    ".MuiDataGrid-columnHeaderDraggableContainer": {
      width: "100%",
    },
    ".MuiDataGrid-columnHeaderTitleContainer": {
      display: "block",
    },
    ".MuiDataGrid-columnHeaderTitleContainerContent": {
      height: "100%",
    },
    ".MuiDataGrid-columnHeader:focus": {
      outline: "none",
    },
    border: "none",
    background: "transparent",
  };

  const mergedStyles = { ...rootStyles, ...sx };

  return (
    <DataGrid
      rows={rows}
      columns={columns.map((col) => ({
        ...col,
        renderHeader: (rowParams: GridColumnHeaderParams) => {
          const specificFieldFilterData = filterData?.[rowParams?.field];
          return (
            <GridTableHeader
              rowParams={rowParams}
              filterData={specificFieldFilterData}
              onFilterSubmit={onFilterSubmit}
            />
          );
        },
      }))}
      localeText={{
        toolbarExport: t("Export"),
        toolbarExportCSV: t("Download as CSV"),
        toolbarExportPrint: t("Print"),
        noRowsLabel: t("No data"),
      }}
      disableDensitySelector
      disableVirtualization
      hideFooterPagination
      disableColumnFilter
      disableColumnMenu
      showColumnVerticalBorder={false}
      showCellVerticalBorder={false}
      hideFooter
      rowSelection={false}
      density="comfortable"
      slots={{
        toolbar: () => (
          <Box padding="5px" display="flex" justifyContent="flex-end">
            <GridToolbarExport sx={{ color: "text.primary" }} />
          </Box>
        ),
      }}
      slotProps={{
        panel: {
          sx: {
            "& .MuiTypography-root": {
              color: "success.main",
            },
            "& .MuiDataGrid-filterForm": {
              bgcolor: "lightblue",
            },
          },
        },
        toolbar: {
          sx: {
            "& .MuiButtonBase-root": {
              color: "text.primary",
            },
          },
        },
      }}
      sx={mergedStyles}
      {...rest}
    />
  );
};

export const GridTableHeader: React.FC<IGridTableHeaderProps> = ({ rowParams, filterData, onFilterSubmit }) => {
  const t = useTranslations();
  const [filterMenu, setFilterMenu] = React.useState<HTMLElement | null>(null);
  const [formValues, setFormValues] = React.useState<Record<string, any> | null>(null);
  const [submitFormValues, setSubmitFormValues] = React.useState<Record<string, any> | null>(null);
  const open = !!filterMenu;

  const {
    watch,
    handleSubmit,
    register,
    resetField,
    setValue,
    formState: { isSubmitted },
  } = useForm();

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setFilterMenu(event.currentTarget);
  };

  const handleMenuClose = () => {
    setFilterMenu(null);

    if (formValues != null && !isSubmitted) {
      for (let field in formValues) {
        resetField(field);
      }
    }

    if (submitFormValues != null) {
      for (let field in submitFormValues) {
        setValue(field, submitFormValues[field]);
      }
    }
  };

  const filterSelectionQuantity = (values: Record<string, any> | null): number => {
    if (values != null) return Object.values(values).filter((v) => v).length;
    return 0;
  };

  const onSubmit = async (data: Record<string, any>) => {
    setSubmitFormValues(data);
    setFormValues(data);
    setFilterMenu(null);
    onFilterSubmit && onFilterSubmit({ value: data, rowParams: rowParams });
  };

  React.useEffect(() => {
    const subscription = watch((value) => setFormValues(value));
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <Box
      display="flex"
      width="100%"
      gap="40px"
      height="100%"
      justifyContent="space-between"
      alignItems="center"
      paddingLeft="10px"
      paddingRight="15px"
    >
      <Typography color="text.primary" fontWeight={600}>
        {rowParams?.colDef?.headerName}
      </Typography>
      {filterData && (
        <>
          <Box
            onClick={(e: any) => handleMenuOpen(e)}
            color="success.main"
            height="fit-content"
            display="flex"
            sx={{
              "&:hover": {
                opacity: "0.7",
              },
              cursor: "pointer",
            }}
          >
            {open || filterSelectionQuantity(submitFormValues) > 0 ? (
              <Badge
                badgeContent={filterSelectionQuantity(submitFormValues)}
                sx={{
                  "& .MuiBadge-badge": {
                    color: "success.main",
                    border: "1px solid",
                    background: "#fff",
                  },
                }}
                max={9}
              >
                <FilterAltIcon color="success" />
              </Badge>
            ) : (
              <FilterAltOutlinedIcon />
            )}
          </Box>

          <Menu anchorEl={filterMenu} open={open} onClose={handleMenuClose}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} px="10px" minWidth={250}>
              <FormGroup>
                {filterData.map(({ outputField, label }, index) => (
                  <MenuItem key={index} sx={{ padding: 0, margin: 0 }}>
                    <Checkbox
                      name={outputField}
                      register={register}
                      label={label}
                      checked={!!formValues?.[outputField] ?? false}
                    />
                  </MenuItem>
                ))}
              </FormGroup>
              <Button
                type="submit"
                sx={{
                  bgcolor: "transparent",
                  color: "success.main",
                  boxShadow: "none",
                  "&:hover": {
                    color: "white",
                    bgcolor: "success.main",
                  },
                }}
              >
                {t("Done")}
              </Button>
            </Box>
          </Menu>
        </>
      )}
    </Box>
  );
};
