import React from "react";
import { GridTable, IFilterSubmitParams, IGridColDef, IGridTableProps } from "@/components/ui/GridTable";
import { useFilterValues } from "../core/FilterValuesContext";
import { useMediaQuery } from "@mui/material";
import { InheritanceCasesTableActions } from "./InheritanceCasesTableActions";
import { GridValueGetterParams } from "@mui/x-data-grid";
import { useLocale } from "next-intl";

interface InheritanceCasesTableProps extends Omit<IGridTableProps, "columns"> {}

const InheritanceCasesTable = React.forwardRef<HTMLDivElement, InheritanceCasesTableProps>(
  ({ className, ...props }, ref) => {
    const isMobileMedia = useMediaQuery("(max-width:800px)");
    const locale = useLocale();
    const { updateFilterValues } = useFilterValues();

    const handleUpdateFilterValues = (value: IFilterSubmitParams) => {
      const type = value.rowParams.colDef.filter?.type;
      if (type === "simple") {
        const field = value.rowParams.colDef.field;
        const filterValue = value?.value;
        if (!!filterValue && !Array.isArray(filterValue)) updateFilterValues(field as any, filterValue as string);
        else updateFilterValues(field as any, "");
      }
    };

    const columns: IGridColDef[] = [
      {
        field: "notaryUniqNumber",
        headerName: "Registry number",
        width: 210,
        sortable: false,
        filter: {
          type: "simple",
        },
      },
      {
        field: "requester.personalNumber",
        headerName: "PIN of the deceased",
        width: 210,
        filter: {
          type: "simple",
        },
        sortable: false,
      },
      {
        field: "requester.fullName",
        headerName: "Full name of the deceased",
        width: 270,
        filter: {
          type: "simple",
        },
        sortable: false,
      },
      {
        field: "requester.birthDate",
        headerName: "Date of birth",
        width: 180,
      },
      {
        field: "requester.actualResidenceAddress.addressL2",
        headerName: "Place of last residence",
        width: 270,
        sortable: false,
        valueGetter: (params: GridValueGetterParams) => {
          const nameKey = locale !== "en" ? "$t:name" : "name";
          const region = params.row?.["requester.mainAddress.region"]?.[nameKey] || "";
          const district = params.row?.["requester.mainAddress.district"]?.[nameKey] || "";
          const city = params.row?.["requester.mainAddress.city.name"] || "";
          const addressL4 = params.row?.["requester.mainAddress.addressL4"] || "";
          const addressL3 = params.row?.["requester.mainAddress.addressL3"] || "";
          const addressL2 = params.row?.["requester.mainAddress.addressL2"] || "";
          const format = (text: string | null) => {
            if (!text) return "";
            return `${text} /`;
          };

          return `${format(region)} ${format(district)} ${format(city)} ${format(addressL4)} ${format(
            addressL3
          )} ${addressL2}`;
        },
      },
      {
        field: "requester.deathDate",
        headerName: "Date of death",
        width: 200,
      },
      {
        field: "creationDate",
        headerName: "Date of creation",
        width: 210,
      },
      {
        field: "company.name",
        headerName: "Created by",
        width: 200,
        sortable: false,
      },
      {
        field: "actions",
        headerName: "Actions",
        headerClassName: "pinnable",
        width: isMobileMedia ? 250 : 350,
        sortable: false,
        type: isMobileMedia ? "actions" : "string",
        cellClassName: isMobileMedia ? "actions-pinnable" : "actions-on-hover",
        renderCell: (params) => <InheritanceCasesTableActions params={params} />,
      },
    ];

    return (
      <GridTable
        {...props}
        loading={props.loading}
        rows={props.rows}
        columns={columns}
        cellMaxHeight="200px"
        rowHeight={65}
        autoHeight
        sx={{
          ".MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell": {
            padding: "10px 16px",
            whiteSpace: "normal",
          },
          ".MuiDataGrid-columnHeader": { padding: "16px" },
          ...(props.sx || {}),
        }}
        onFilterSubmit={handleUpdateFilterValues}
      />
    );
  }
);

InheritanceCasesTable.displayName = "InheritanceCasesTable";
export default InheritanceCasesTable;
