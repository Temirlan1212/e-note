import React from "react";
import { GridTable, IFilterSubmitParams, IGridColDef, IGridTableProps } from "@/components/ui/GridTable";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { useFilterValues } from "@/components/inheritance-cases/inheritance-cases-list.tsx/core/FilterValuesContext";

interface HeirsTableProps extends Omit<IGridTableProps, "columns"> {}

const columns: IGridColDef[] = [
  {
    field: "QR",
    headerName: "ПИН",
    width: 90,
    sortable: false,
  },
  {
    field: "requester",
    headerName: "ФИО",
    width: 210,
    sortable: false,
  },
  {
    field: "pin",
    headerName: "Родственные отношения",
    width: 210,
    sortable: false,
  },
  {
    field: "createdOn",
    headerName: "Дата заявления",
    width: 270,
    sortable: false,
  },
  {
    field: "dateOfBirth",
    headerName: "Адрес",
    width: 180,
  },
  {
    field: "placeOfLastResidence",
    headerName: "Номер моб. телефона",
    width: 270,
    sortable: false,
  },
];

const HeirsTable = React.forwardRef<HTMLDivElement, HeirsTableProps>(({ className, ...props }, ref) => {
  const { updateFilterValues } = useFilterValues();

  const handleUpdateFilterValues = (value: IFilterSubmitParams) => {
    const type = value.rowParams.colDef.filter?.type;
    if (type === "simple") {
      const field = value.rowParams.colDef.field;
      const filterValue = value?.value;
      updateFilterValues(field as any, filterValue as string);
    }
  };

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
});

HeirsTable.displayName = "HeirsTable";
export default HeirsTable;
