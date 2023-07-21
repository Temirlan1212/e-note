import { useTranslations } from "next-intl";
import { GridTable, IFilterSubmitParams } from "../ui/GridTable";
import { Box, LinearProgress } from "@mui/material";
import {
  GridColDef,
  GridRenderCellParams,
  GridSortModel,
  GridTreeNodeWithRender,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { useDictionaryStore } from "@/stores/dictionaries";
import { useEffect, useState } from "react";
import { useApplicationStore } from "@/stores/applications";
import { SortType } from "@/models/applications/applications";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DetailsIcon from "@/public/icons/details-action.svg";
import DownloadIcon from "@/public/icons/download-action.svg";
import EditIcon from "@/public/icons/edit-action.svg";

interface IGridTableWithActions {}

export default function GridTableWitActions({}: IGridTableWithActions) {
  const t = useTranslations();
  const getApplicationsData = useApplicationStore((state) => state.getApplicationsData);
  const applicationsData = useApplicationStore((state) => state.applicationsData);
  const actionTypeData = useDictionaryStore((store) => store.actionTypeData);
  const statusData = useDictionaryStore((store) => store.statusData);
  const [isLoading, setIsLoading] = useState(false);
  const [filterSubmitValue, setFilterSubmitValue] = useState<(string | number)[]>([]);
  const [sortValue, setSortValue] = useState<SortType>("asc");

  const handleFilterSubmit = async ({ value }: IFilterSubmitParams) => {
    setFilterSubmitValue(value);
  };

  const handleSortByDate = async (model: GridSortModel) => {
    const gridSortItem = model[0];
    if (gridSortItem?.sort != null) setSortValue(gridSortItem.sort);
  };

  const getApplications = async () => {
    setIsLoading(true);
    await getApplicationsData({});
    setIsLoading(false);
  };

  const handleAppQueryParamsChange = async (filterValue: (string | number)[], sortValue: SortType) => {
    setIsLoading(true);
    await getApplicationsData({ filter: { field: "typeNotarialAction", value: filterValue }, sortBy: sortValue });
    setIsLoading(false);
  };

  useEffect(() => {
    handleAppQueryParamsChange(filterSubmitValue, sortValue);
  }, [filterSubmitValue, sortValue]);

  useEffect(() => {
    getApplications();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "typeNotarialAction",
      headerName: "Вид действия",
      width: 200,
      editable: false,
      sortable: false,
      valueGetter: (params: GridValueGetterParams) => {
        if (actionTypeData != null) {
          const matchedItem = actionTypeData?.find((item) => item.value == params.value);
          return matchedItem?.title;
        }

        return params.value;
      },
    },
    {
      field: "product.fullName",
      headerName: "Вид документа",
      width: 250,
      editable: false,
      sortable: false,
    },
    {
      field: "statusSelect",
      headerName: "Статус",
      width: 200,
      editable: false,
      sortable: false,
      valueGetter: (params: GridValueGetterParams) => {
        if (statusData != null) {
          const matchedItem = statusData?.find((item) => item.value == String(1));
          return matchedItem?.title;
        }

        return params.value;
      },
    },
    {
      field: "creationDate",
      headerName: "Дата",
      width: 170,
      sortable: true,
    },
    {
      field: "createdBy.fullName",
      headerName: "Нотариус",
      width: 200,
      sortable: false,
      cellClassName: "notaryColumn",
    },
    {
      field: "actions",
      headerName: "",
      width: 200,
      sortable: false,
      type: "actions",
      renderCell: (params) => <ActionsCell params={params} />,
    },
  ];

  return (
    <Box height="500px">
      <GridTable
        columns={columns}
        rows={applicationsData ?? []}
        filterData={{
          data: { typeNotarialAction: actionTypeData ?? [] },
          filterField: { field: "title", outputField: "value" },
        }}
        onFilterSubmit={handleFilterSubmit}
        onSortModelChange={handleSortByDate}
        cellMaxHeight="200px"
        loading={isLoading}
        sx={{
          height: "100%",
          ".notaryColumn": {
            color: "success.main",
          },
        }}
        slots={{
          loadingOverlay: () => <LinearProgress color="success" />,
        }}
      />
    </Box>
  );
}

export const ActionsCell = ({ params }: { params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender> }) => {
  return (
    <Box display="flex" alignItems="center" gap="10px">
      <Box>
        <DetailsIcon />
      </Box>
      <Box>
        <EditIcon />
      </Box>
      <Box>
        <DownloadIcon />
      </Box>
      <Box>
        <DeleteOutlineIcon />
      </Box>
    </Box>
  );
};
