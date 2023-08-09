import * as React from "react";
import { DataGrid, GridRowsProp, GridColDef, DataGridProps, GridValidRowModel } from "@mui/x-data-grid";
import { Box, LinearProgress, MenuItem, Typography, lighten } from "@mui/material";
import Menu from "@mui/material/Menu";
import Checkbox from "./Checkbox";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Badge from "@mui/material/Badge";
import Hint from "@/components/ui/Hint";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Input from "./Input";
import { GridStateColDef } from "@mui/x-data-grid/internals";

export type IGridColDefSimple = {
  filter?: {
    type: "simple";
  };
} & GridColDef;

export type IGridColDefDictionary = {
  filter?: {
    type: "dictionary";
    data: Record<string, any>[];
    labelField: string;
    valueField: string;
    field: string | number;
  };
} & GridColDef;

export type IGridColDef = IGridColDefSimple | IGridColDefDictionary;

export interface IGridRowParamsHeaderProps<R extends GridValidRowModel = GridValidRowModel, V = any, F = V> {
  field: string;
  colDef: GridStateColDef<R, V, F> & IGridColDef;
}

export interface IFilterSubmitParams {
  value: (string | number)[] | string;
  rowParams: IGridRowParamsHeaderProps<GridValidRowModel, any, any>;
}

export interface IGridTableProps extends DataGridProps {
  rows: GridRowsProp;
  columns: IGridColDef[];
  onFilterSubmit?: (v: IFilterSubmitParams) => void;
  cellMaxHeight?: string | number;
  headerCellMaxHeight?: string | number;
}

export interface IGridTableHeaderProps {
  rowParams: IGridRowParamsHeaderProps;
  onFilterSubmit?: (v: IFilterSubmitParams) => void;
}

export const GridTable: React.FC<IGridTableProps> = ({
  columns,
  rows,
  cellMaxHeight,
  onFilterSubmit,
  headerCellMaxHeight,
  sx,
  ...rest
}) => {
  const t = useTranslations();
  const rootStyles = {
    height: "100%",
    ".MuiDataGrid-cell": {
      borderBottom: "none",
      color: "text.primary",
      fontWeight: "500",
      outline: 0,
    },
    ".MuiDataGrid-row": {
      border: "1px solid transparent",
      maxHeight: cellMaxHeight ? cellMaxHeight + " !important" : "fit-content !important",

      "&:hover": {
        backgroundColor: lighten("#F6F6F6", 0.7),
      },
    },
    ".css-yrdy0g-MuiDataGrid-columnHeaderRow": {
      display: "flex",
      alignItems: "center",
    },
    ".MuiDataGrid-columnHeaders": {
      maxHeight: (headerCellMaxHeight ? headerCellMaxHeight : "fit-content") + "  !important",
      border: "1px solid #CDCDCD",
      background: "#fff",

      ".MuiDataGrid-columnHeader": {
        height: "100% !important",
        ".MuiDataGrid-columnHeaderTitleContainer": {
          textWrap: "wrap !important",
        },

        "&:focus": {
          outline: "none",
        },
      },
    },

    ".MuiDataGrid-cell:focus": {
      outline: "none",
    },
    ".MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell": {
      whiteSpace: "normal",
      maxHeight: "100% !important",
      padding: "10px",
      ".MuiDataGrid-cellContent": {
        overflow: "auto",
        display: "block",
        alignItems: "center",
        overflowWrap: "break-word",
      },
    },
    ".MuiDataGrid-cell:focus-within": {
      outline: "none",
    },
    ".MuiDataGrid-virtualScroller": {
      scrollBehavior: "smooth",
    },
    border: "none",
    background: "#F6F6F6",
  };

  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const handleScrollLeft = () => {
    if (containerRef.current) {
      const virtualScroller = containerRef.current.querySelector(".MuiDataGrid-virtualScroller");

      if (virtualScroller) virtualScroller.scrollLeft -= 200;
    }
  };

  const handleScrollRight = () => {
    if (containerRef.current) {
      const virtualScroller = containerRef.current.querySelector(".MuiDataGrid-virtualScroller");

      if (virtualScroller) virtualScroller.scrollLeft += 200;
    }
  };

  const mergedStyles = { ...rootStyles, ...sx };

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Box
        display={{ xs: "flex", md: "none" }}
        justifyContent="space-between"
        marginBottom="20px"
        gap="20px"
        alignItems="center"
        flexWrap="wrap"
      >
        <Box>
          <Hint type="hint" defaultActive={false}>
            {t("The table can be scrolled horizontally or you can use the buttons to move around the table")}
          </Hint>
        </Box>
        <Box display="flex" gap="10px">
          <Button
            size="small"
            onClick={handleScrollLeft}
            sx={{ bgcolor: "white", "&:hover": { bgcolor: "transparent" } }}
          >
            <ChevronLeftIcon color="success" />
          </Button>
          <Button onClick={handleScrollRight} sx={{ bgcolor: "white", "&:hover": { bgcolor: "transparent" } }}>
            <ChevronRightIcon color="success" />
          </Button>
        </Box>
      </Box>
      <DataGrid
        ref={containerRef}
        rows={rows}
        columns={columns?.map((col) => ({
          ...col,
          renderHeader: (rowParams: IGridRowParamsHeaderProps) => {
            return <GridTableHeader rowParams={rowParams} onFilterSubmit={onFilterSubmit} />;
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
        hideFooter
        rowSelection={false}
        density="comfortable"
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
        slots={{
          loadingOverlay: () => <LinearProgress color="success" />,
        }}
        sx={mergedStyles}
        {...rest}
      />
    </Box>
  );
};

export const GridTableHeader: React.FC<IGridTableHeaderProps> = ({ rowParams, onFilterSubmit }) => {
  const type = rowParams.colDef.filter?.type;

  let dictionaryList: Record<string, any>[] = [];
  let valueField: string = "";
  let labelField: string = "";

  if (type === "dictionary") {
    const data = rowParams.colDef.filter?.data;
    if (Array.isArray(data)) dictionaryList = data as Record<string, any>[];
    valueField = rowParams.colDef.filter?.valueField as string;
    labelField = rowParams.colDef.filter?.labelField as string;
  }

  const t = useTranslations();
  const [filterMenu, setFilterMenu] = React.useState<HTMLElement | null>(null);
  const [formValues, setFormValues] = React.useState<Record<string, any> | null>(null);
  const [isClearDisabled, setIsClearDisabled] = React.useState<boolean>(false);
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
      resetFields();
    }

    if (submitFormValues != null) {
      for (let field in submitFormValues) {
        setValue(field, submitFormValues[field]);
      }
    }
  };

  const resetFields = () => {
    for (let field in formValues) {
      resetField(field);
    }
  };

  const resetForm = () => {
    if (formValues != null) {
      resetFields();
      setSubmitFormValues(null);
      setFilterMenu(null);
      onFilterSubmit && onFilterSubmit({ value: [], rowParams: rowParams });
    }
  };

  const filterSelectionQuantity = (values: Record<string, any> | null): number => {
    if (values != null) return Object.values(values).filter((v) => v).length;
    return 0;
  };

  const onSubmit = async (data: Record<string, any>) => {
    if (type === "dictionary" && onFilterSubmit) {
      setSubmitFormValues(data);
      setFormValues(data);
      const keysWithTrueValues = Object.keys(data).filter((key) => data[key] === true);
      onFilterSubmit({ value: keysWithTrueValues, rowParams });
    }

    if (type === "simple" && onFilterSubmit) {
      onFilterSubmit({ value: data.input, rowParams });
    }

    setFilterMenu(null);
  };

  React.useEffect(() => {
    const subscription = watch((value) => {
      setIsClearDisabled(Object.values(value).some((v) => v));
      setFormValues(value);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <Box
      display="flex"
      width={rowParams?.colDef?.width ?? "100%"}
      height="100%"
      justifyContent="space-between"
      alignItems="center"
      py="10px"
      paddingRight="15px"
      gap="40px"
    >
      <Typography color="text.primary" fontWeight={600}>
        {rowParams?.colDef?.headerName ? t(rowParams?.colDef?.headerName) : ""}
      </Typography>
      {!!type && (
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

          <Menu
            anchorEl={filterMenu}
            open={open}
            onClose={handleMenuClose}
            sx={{ ".MuiList-padding": { padding: "0px" } }}
          >
            <Box component="form" onSubmit={handleSubmit(onSubmit)} paddingTop="10px" minWidth={250}>
              {type === "simple" && (
                <Box display="flex" justifyContent="center" mb="10px">
                  <Input size="small" register={register} name="input" />
                </Box>
              )}

              {type === "dictionary" && (
                <Box
                  maxHeight={190}
                  overflow="auto"
                  maxWidth={250}
                  sx={{
                    "::-webkit-scrollbar": { width: "4px" },
                    "::-webkit-scrollbar-thumb": {
                      background: "#E0E0E0",
                    },
                  }}
                >
                  {dictionaryList.map((item, index) => (
                    <MenuItem key={index} sx={{ padding: 0, margin: "0 0 10px 0" }}>
                      <Checkbox
                        sx={{ px: "10px" }}
                        name={String(item[valueField])}
                        register={register}
                        label={item[labelField]}
                        checked={!!formValues?.[String(item[valueField])]}
                        width={"100%"}
                      />
                    </MenuItem>
                  ))}

                  {dictionaryList.length < 1 && <Typography textAlign="center">{t("No data")}</Typography>}
                </Box>
              )}

              <Box display="flex" borderTop="1px solid #E0E0E0">
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
                  {t("Apply")}
                </Button>

                <Button
                  onClick={() => resetForm()}
                  disabled={!isClearDisabled}
                  sx={{
                    bgcolor: "transparent",
                    color: "success.main",
                    boxShadow: "none",
                    "&:hover": {
                      color: "white",
                      bgcolor: "error.main",
                    },
                  }}
                >
                  {t("Reset")}
                </Button>
              </Box>
            </Box>
          </Menu>
        </>
      )}
    </Box>
  );
};
