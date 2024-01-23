import React from "react";
import { GridTable, IFilterSubmitParams, IGridColDef, IGridTableProps } from "@/components/ui/GridTable";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { useFilterValues } from "../core/FilterValuesContext";
import { useMediaQuery } from "@mui/material";
import { InheritanceCasesTableActions } from "./InheritanceCasesTableActions";

interface InheritanceCasesTableProps extends Omit<IGridTableProps, "columns"> {}

const InheritanceCasesTable = React.forwardRef<HTMLDivElement, InheritanceCasesTableProps>(
  ({ className, ...props }, ref) => {
    const isMobileMedia = useMediaQuery("(max-width:800px)");
    const { updateFilterValues } = useFilterValues();

    const handleUpdateFilterValues = (value: IFilterSubmitParams) => {
      const type = value.rowParams.colDef.filter?.type;
      if (type === "simple") {
        const field = value.rowParams.colDef.field;
        const filterValue = value?.value;
        updateFilterValues(field as any, filterValue as string);
      }
    };

    const columns: IGridColDef[] = [
      {
        field: "QR",
        headerName: "QR",
        width: 90,
        sortable: false,
        renderCell: (params: any) => <QrCode2Icon />,
      },
      {
        field: "registryNumber",
        headerName: "Registry number",
        width: 210,
        sortable: false,
        filter: {
          type: "simple",
        },
      },
      {
        field: "pin",
        headerName: "PIN of the deceased",
        width: 210,
        filter: {
          type: "simple",
        },
        sortable: false,
      },
      {
        field: "fullName",
        headerName: "Full name of the deceased",
        width: 270,
        filter: {
          type: "simple",
        },
        sortable: false,
      },
      {
        field: "dateOfBirth",
        headerName: "Date of birth",
        width: 180,
      },
      {
        field: "placeOfLastResidence",
        headerName: "Place of last residence",
        width: 270,
        sortable: false,
      },
      {
        field: "dateOfDeath",
        headerName: "Date of death",
        width: 200,
      },
      {
        field: "dateOfCreation",
        headerName: "Date of creation",
        width: 210,
      },
      {
        field: "whoCreated",
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
        columns={columns}
        sx={{
          ".MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell": {
            padding: "10px 16px",
            whiteSpace: "normal",
          },
          ".MuiBox-root": { backgroundColor: "#FFF" },
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
