import React from "react";
import { GridTable, IFilterSubmitParams, IGridColDef, IGridTableProps } from "@/components/ui/GridTable";
import { Box, useMediaQuery } from "@mui/material";
import { GridSortModel, GridValueGetterParams } from "@mui/x-data-grid";
import { TableActions } from "./components/TableActions";
import { useFetchListParams } from "@/contexts/fetch-list-params";
import { InheritanceCasesFilterValuesProps } from "@/models/inheritance-cases";
import { QrMenu } from "@/components/qr-menu/QrMenu";
import { useLocale } from "next-intl";

interface WillsTableProps extends Omit<IGridTableProps, "columns"> {}

const WillsTable = React.forwardRef<HTMLDivElement, WillsTableProps>(({ className, ...props }, ref) => {
  const locale = useLocale();

  const isMobileMedia = useMediaQuery("(max-width:800px)");

  const {
    updateFilterValues,
    updateParams,
    params: { requestType },
  } = useFetchListParams<InheritanceCasesFilterValuesProps>();

  const handleUpdateFilterValues = (value: IFilterSubmitParams) => {
    const type = value.rowParams.colDef.filter?.type;
    if (type === "simple") {
      const field = value.rowParams.colDef.field;
      const filterValue = value?.value;
      if (!!filterValue && !Array.isArray(filterValue)) updateFilterValues(field as any, filterValue as string);
      else updateFilterValues(field as any, "");
    }
  };

  const handleSortByDate = async (model: GridSortModel) => {
    const sortBy = model.map((s) => (s.sort === "asc" ? s.field : `-${s.field}`));
    updateParams("sortBy", sortBy);
  };

  const columns: IGridColDef[] = [
    {
      field: "QR",
      headerName: "QR",
      width: 70,
      sortable: false,
      renderCell: (params: any) => <QrMenu params={params} />,
    },
    {
      field: "notaryUniqNumber",
      headerName: "Registry number",
      width: 210,
      sortable: false,
      filter: {
        type: "simple",
        disabled: requestType === "search",
      },
    },
    {
      field: "requester.personalNumber",
      headerName: "PIN",
      width: 210,
      sortable: false,
      filter: {
        type: "simple",
        disabled: requestType === "search",
      },
    },
    {
      field: "requester.fullName",
      headerName: "TestatorFullName",
      width: 270,
      sortable: false,
      filter: {
        type: "simple",
        disabled: requestType === "search",
      },
    },
    {
      field: "requester.birthDate",
      headerName: "Date of birth",
      width: 180,
      sortable: false,
    },
    {
      field: "creationDate",
      headerName: "Date of creation",
      width: 210,
      sortable: true,
    },
    {
      field: "company.name",
      headerName: "Created by",
      width: 200,
      sortable: false,
    },
    {
      field: "company.notaryDistrict",
      headerName: "Notary district",
      cellClassName: "executor-column",
      width: 200,
      sortable: false,
      valueGetter: (params: GridValueGetterParams) => {
        const nameKey = locale !== "en" ? "$t:name" : "name";
        return params.value?.[nameKey];
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      headerClassName: "pinnable",
      width: isMobileMedia ? 250 : 350,
      sortable: false,
      type: isMobileMedia ? "actions" : "string",
      cellClassName: isMobileMedia ? "actions-pinnable" : "actions-on-hover",
      renderCell: (params) => <TableActions params={params} />,
    },
  ];

  return (
    <Box ref={ref}>
      <GridTable
        {...props}
        loading={props.loading}
        rows={props.rows}
        columns={columns}
        cellMaxHeight="200px"
        rowHeight={65}
        autoHeight
        sx={{
          ".executor-column": {
            color: "success.main",
          },
          ".MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell": {
            padding: "10px 16px",
            whiteSpace: "normal",
          },
          ".MuiDataGrid-columnHeader": { padding: "16px" },
          ...(props.sx || {}),
        }}
        onFilterSubmit={handleUpdateFilterValues}
        onSortModelChange={handleSortByDate}
      />
    </Box>
  );
});

WillsTable.displayName = "WillsTable";
export default WillsTable;
