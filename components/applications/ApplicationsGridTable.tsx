import { GridTable, IFilterSubmitParams } from "../ui/GridTable";
import { Box, LinearProgress } from "@mui/material";
import { GridColDef, GridSortModel, GridValueGetterParams } from "@mui/x-data-grid";
import { useDictionaryStore } from "@/stores/dictionaries";
import { useEffect, useState } from "react";
import { useApplicationStore } from "@/stores/applications";
import { SortType } from "@/models/applications/applications";
import { GridTableActionsCell } from "./GridTableActionsCell";
import { useRouter } from "next/router";
import { IActionType } from "@/models/dictionaries/action-type";
import Pagination from "@/components/ui/Pagination";

interface IApplicationsGridTable {}

enum ApplicationPagination {
  LIMIT = 5,
  FILTER_OFFSET = 0,
}

export default function ApplicationsGridTable({}: IApplicationsGridTable) {
  const { locale } = useRouter();
  const getApplicationsData = useApplicationStore((state) => state.getApplicationsData);
  const applicationsData = useApplicationStore((state) => state.applicationsData);
  const applicationsTotal = useApplicationStore((state) => state.applicationsTotal);
  const actionTypeData = useDictionaryStore((store) => store.actionTypeData);
  const documentTypeData = useDictionaryStore((store) => store.documentTypeData);
  const statusData = useDictionaryStore((store) => store.statusData);
  const [isLoading, setIsLoading] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, (string | number)[]>>({});
  const [sortValue, setSortValue] = useState<SortType>("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleFilterSubmit = async (value: IFilterSubmitParams) => {
    const outPutFieldName = value.rowParams.colDef.description;

    if (outPutFieldName) {
      if (value.value.length > 0) {
        setFilterValues((prev) => {
          return { ...prev, [outPutFieldName]: value.value };
        });
      } else {
        const keyToDelete = outPutFieldName;
        const updatedFilterValues = { ...filterValues };
        delete updatedFilterValues[keyToDelete];
        setFilterValues(updatedFilterValues);
      }
    }
  };

  const handleSortByDate = async (model: GridSortModel) => {
    const gridSortItem = model[0];
    if (gridSortItem?.sort != null) setSortValue(gridSortItem.sort);
  };

  // const handleChangeAppQueryParams = () => {}

  const handleFilterAndSort = async (
    filterValues: Record<string, (string | number)[]>,
    sortValue: SortType,
    offset: number
  ) => {
    setIsLoading(true);
    await getApplicationsData({
      filterValues,
      sortBy: sortValue,
      limit: ApplicationPagination.LIMIT,
      offset,
    });
    setIsLoading(false);
  };

  const handlePageChange = (page: number) => {
    if (Object.keys(filterValues).length > 0) {
      handleFilterAndSort(filterValues, sortValue, ApplicationPagination.LIMIT * (page - 1));
    }
    if (Object.keys(filterValues).length < 1) {
      getApplicationsData({ limit: ApplicationPagination.LIMIT, offset: ApplicationPagination.LIMIT * (page - 1) });
    }
    setPage(page);
  };

  useEffect(() => {
    if (Object.keys(filterValues).length > 0) {
      handleFilterAndSort(filterValues, sortValue, 0);
      setPage(1);
    }
    if (Object.keys(filterValues).length < 1) {
      getApplicationsData({ limit: ApplicationPagination.LIMIT, offset: ApplicationPagination.LIMIT * (page - 1) });
    }
  }, [filterValues, sortValue]);

  useEffect(() => {
    if (applicationsTotal != null) {
      setTotalPages(Math.ceil(applicationsTotal / ApplicationPagination.LIMIT));
    }
  }, [applicationsTotal]);

  useEffect(() => {
    if (Object.keys(filterValues).length < 1) {
      getApplicationsData({ limit: ApplicationPagination.LIMIT, offset: ApplicationPagination.LIMIT * (page - 1) });
    }
  }, []);

  const columns: GridColDef[] = [
    {
      field: "typeNotarialAction",
      headerName: "Type of action",
      description: "typeNotarialAction",
      width: 200,
      editable: false,
      sortable: false,
      valueGetter: (params: GridValueGetterParams) => {
        if (actionTypeData != null) {
          const matchedItem = actionTypeData?.find((item) => item.value == params.value);
          return matchedItem?.[("title_" + locale) as keyof IActionType];
        }

        return params.value;
      },
    },
    {
      field: "product.name",
      description: "product.id",
      headerName: "Type of document",
      width: 250,
      editable: false,
      sortable: false,
    },
    {
      field: "statusSelect",
      headerName: "Status",
      description: "statusSelect",
      width: 200,
      editable: false,
      sortable: false,
      valueGetter: (params: GridValueGetterParams) => {
        if (statusData != null) {
          const matchedItem = statusData?.find((item) => item.value == String(1));
          return matchedItem?.[("title_" + locale) as keyof IActionType];
        }

        return params.value;
      },
    },
    {
      field: "creationDate",
      headerName: "Date",
      width: 170,
      sortable: true,
    },
    {
      field: "createdBy.fullName",
      headerName: "Notary",
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
      renderCell: (params) => <GridTableActionsCell params={params} />,
    },
  ];

  return (
    <Box>
      <Box height="500px">
        <GridTable
          columns={columns}
          rows={applicationsData ?? []}
          filterData={{
            data: {
              typeNotarialAction: actionTypeData ?? [],
              statusSelect: statusData ?? [],
              "product.name": documentTypeData ?? [],
            },
            filterField: {
              typeNotarialAction: { field: "title_ru", outputField: "value" },
              statusSelect: { field: "title_ru", outputField: "value" },
              "product.name": { field: "name", outputField: "id" },
            },
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
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </Box>
  );
}
