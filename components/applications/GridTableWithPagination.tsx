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
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";

export default function GridTableWithPagination() {
  const url = "/api/applications/applications";

  const { locale } = useRouter();
  const getApplicationsData = useApplicationStore((state) => state.getApplicationsData);
  const applicationsData = useApplicationStore((state) => state.applicationsData);
  const applicationsTotal = useApplicationStore((state) => state.applicationsTotal);
  const actionTypeData = useDictionaryStore((store) => store.actionTypeData);
  const documentTypeData = useDictionaryStore((store) => store.documentTypeData);
  const statusData = useDictionaryStore((store) => store.statusData);
  const [filterValues, setFilterValues] = useState<Record<string, (string | number)[]>>({});
  const [sortValue, setSortValue] = useState<SortType>("asc");
  const [pagination, setPagination] = useState<{ pageSize: number; page: number; sortBy: string[] }>({
    pageSize: 5,
    page: 1,
    sortBy: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const isFilterValueEmty = () => Object.keys(filterValues).length < 1;

  const _domain = Object.keys(filterValues)
    .map((key) => `self.${key} in :${key.replace(/[.\s]/g, "")}`)
    .join(" and ");

  const { data, loading, update } = useFetch(url, "POST", {
    body: {
      ...pagination,
    },
    useEffectOnce: false,
    returnResponse: true,
  });

  useEffectOnce(async () => {
    const reader = data?.data;
    console.log(reader);

    if (reader) {
      const res = await reader.json();
      console.log(res);
    }
  }, [data]);

  const handleFilterSubmit = async (value: IFilterSubmitParams) => {
    handleUpdateFilterValues(value);
    update(url);
  };

  const handlePageChange = (page: number) => {
    if (!isFilterValueEmty()) handleFilterAndSort(page - 1);
    if (isFilterValueEmty()) getApplicationsData({ page: page - 1 });
    setPagination({
      ...pagination,
      page,
    });
  };

  const handleUpdateFilterValues = (value: IFilterSubmitParams) => {
    const outPutFieldName = value.rowParams.colDef.description;
    if (outPutFieldName) {
      if (value.value.length > 0) {
        setFilterValues((prev) => {
          return { ...prev, [outPutFieldName]: value.value };
        });
      } else {
        const updatedFilterValues = { ...filterValues };
        delete updatedFilterValues[outPutFieldName];
        setFilterValues(updatedFilterValues);
      }
    }
  };

  const handleSortByDate = async (model: GridSortModel) => {
    const sortBy = model.map((s) => (s.sort === "asc" ? s.field : `-${s.field}`));
    setPagination({
      ...pagination,
      sortBy,
    });

    if (model[0]?.sort != null) setSortValue(model[0].sort);
  };

  const handleFilterAndSort = async (page: number) => {
    setIsLoading(true);
    // await getApplicationsData({
    //   filterValues,
    //   sortBy: sortValue,
    //   page,
    // });
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isFilterValueEmty()) {
      handleFilterAndSort(0);
      setPagination({
        ...pagination,
        page: 1,
      });
    } else {
      // getApplicationsData({ page: pagination.page - 1 });
    }
  }, [filterValues, sortValue]);

  useEffect(() => {
    // if (isFilterValueEmty()) getApplicationsData({ page: pagination.page - 1 });
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

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
          rows={data?.data ?? []}
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
      <Pagination
        currentPage={pagination.page}
        totalPages={applicationsTotal ? Math.ceil(applicationsTotal / pagination.pageSize) : 0}
        onPageChange={handlePageChange}
      />
    </Box>
  );
}
