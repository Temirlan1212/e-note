import { useTranslations } from "next-intl";
import { GridTable } from "../ui/GridTable";
import { Box } from "@mui/material";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useDictionaryStore } from "@/stores/dictionaries";

interface IGridTableWithActions {}
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "firstName",
    headerName: "First name",
    width: 250,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 250,
    editable: true,
    sortable: true,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 250,
    editable: true,
    sortable: false,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 250,
    valueGetter: (params: GridValueGetterParams) => `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

export default function GridTableWitActions({}: IGridTableWithActions) {
  const t = useTranslations();
  const actionTypeData = useDictionaryStore((store) => store.actionTypeData);
  console.log(actionTypeData);

  return (
    <Box>
      dd
      <GridTable
        columns={columns}
        rows={rows}
        filterData={{
          data: { fullName: actionTypeData ?? [] },
          filterField: { field: "title", outputField: "value" },
        }}
        onFilterSubmit={(data) => console.log(data)}
        onSortModelChange={(data) => console.log(data)}
        filterSelectAllOption={true}
      />
    </Box>
  );
}
