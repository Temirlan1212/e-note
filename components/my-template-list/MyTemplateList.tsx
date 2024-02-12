import { useState, ChangeEvent, Dispatch, SetStateAction, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { ValueOf } from "next/dist/shared/lib/constants";
import { Alert, Box, Collapse, IconButton, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { GridSortModel, GridValueGetterParams } from "@mui/x-data-grid";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import { GridTable, IFilterSubmitParams } from "@/components/ui/GridTable";
import ClearIcon from "@mui/icons-material/Clear";
import { INotarialAction, INotarialActionData } from "@/models/notarial-action";
import { useProfileStore } from "@/stores/profile";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Link from "next/link";

interface ITempQueryParams {
  pageSize: number;
  page: number;
  sortBy: string[];
  filterValues: Record<string, { id: string | number }[]>;
  searchValue: string;
  isSystem: boolean;
  createdById?: number;
}

interface IMyTemplateData {
  templateInfo: {
    editUrl: string;
    token: string;
  };
}

const capitalize = (str: string) => str?.[0].toUpperCase() + str?.slice(1);

function GridTableActionsCell({
  row,
  onDelete,
  setAlertOpen,
}: {
  row: Record<string, any>;
  onDelete: Function;
  setAlertOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const t = useTranslations();
  const router = useRouter();
  const profile = useProfileStore((state) => state.getUserData());

  const isNotary = profile?.group?.name === "Notary";
  const isPrivateNotary = profile?.["activeCompany.typeOfNotary"] === "private";
  const isStateNotary = profile?.["activeCompany.typeOfNotary"] === "state";
  const isActiveNotary = profile?.["activeCompany.statusOfNotary"] === "active";
  const isForeignInstitution = profile?.roles?.[0]?.name === "Foreign institution official";

  const { update: getLicenseInfo } = useFetch<FetchResponseBody | null>("", "POST");
  const { data, update: editTemplate } = useFetch<FetchResponseBody<IMyTemplateData[]>>("", "POST");
  const { update: deleteTemplate } = useFetch("", "POST");

  const handleCheckLicenseDate = async () => {
    const res = await getLicenseInfo(profile?.id != null ? "/api/applications/license-info/" + profile?.id : "");

    const licenseTermUntil = new Date(res?.data?.[0]?.activeCompany?.licenseTermUntil);
    const currentDate = new Date();

    return licenseTermUntil > currentDate;
  };

  const navigateOnCreateClick = () => {
    const url = {
      pathname: "/applications/create",
      query: {
        ...router.query,
        productId: row?.id,
      },
    };
    router.push(url, undefined, { shallow: true });
  };

  const handleCreateClick = async () => {
    if (isNotary) {
      if (isPrivateNotary) {
        const license = await handleCheckLicenseDate();
        !!license && isActiveNotary ? navigateOnCreateClick() : setAlertOpen(true);
      } else if (isStateNotary || isForeignInstitution) {
        isActiveNotary ? navigateOnCreateClick() : setAlertOpen(true);
      }
    } else {
      navigateOnCreateClick();
    }
  };

  const handleDeleteClick = async (callback: Dispatch<SetStateAction<boolean>>) => {
    if (row.id != null) {
      await deleteTemplate("/api/templates/delete", {
        id: row.id,
        version: row.version,
      });
      callback(false);
      onDelete();
    }
  };

  const handleEditClick = async () => {
    if (row.id != null) {
      if (isNotary) {
        if (isPrivateNotary) {
          const license = await handleCheckLicenseDate();
          !!license && isActiveNotary ? await editTemplate("/api/templates/edit/" + row.id) : setAlertOpen(true);
        } else if (isStateNotary) {
          isActiveNotary ? await editTemplate("/api/templates/edit/" + row.id) : setAlertOpen(true);
        }
      } else {
        await editTemplate("/api/templates/edit/" + row.id);
      }
    }
  };

  useEffect(() => {
    if (Array.isArray(data?.data)) {
      const link = data?.data[0];
      if (link?.templateInfo?.editUrl && link?.templateInfo.token) {
        const href = `${link.templateInfo.editUrl}?AuthorizationBasic=${link.templateInfo.token.replace(
          /Basic /,
          ""
        )}` as string;
        window.open(href, "_blank");
      }
    }
  }, [data?.data]);

  return (
    <Box sx={{ display: "flex" }}>
      <Tooltip title={t("New application")} onClick={handleCreateClick}>
        <IconButton>
          <PostAddIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title={t("Edit")} arrow onClick={handleEditClick}>
        <IconButton>
          <ModeEditIcon />
        </IconButton>
      </Tooltip>

      <ConfirmationModal
        hintTitle="Do you really want to remove the template from the platform?"
        title="Deleting a template"
        onConfirm={(callback) => handleDeleteClick(callback)}
      >
        <Tooltip title={t("Delete")} arrow>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </ConfirmationModal>
    </Box>
  );
}

export default function TemplateList() {
  const isMobileMedia = useMediaQuery("(max-width:800px)");
  const profile = useProfileStore((state) => state.getUserData());
  const [tempQueryParams, setTempQueryParams] = useState<ITempQueryParams>({
    pageSize: 7,
    page: 1,
    sortBy: [],
    filterValues: {},
    searchValue: "",
    isSystem: false,
    createdById: profile?.id,
  });
  const [searchValue, setSearchValue] = useState<string>("");
  const [alertOpen, setAlertOpen] = useState(false);

  const t = useTranslations();
  const { locale } = useRouter();

  const { data, loading, update } = useFetch("/api/templates", "POST", {
    body: tempQueryParams,
  });

  const { data: objectData } = useFetch<INotarialActionData>(
    `/api/dictionaries/notarial-action?actionType=object`,
    "POST"
  );

  const { data: objectTypeData } = useFetch<INotarialActionData>(
    `/api/dictionaries/notarial-action?actionType=objectType`,
    "POST"
  );

  const { data: notarialActionData } = useFetch<INotarialActionData>(
    `/api/dictionaries/notarial-action?actionType=notarialAction`,
    "POST"
  );

  const { data: typeNotarialActionData } = useFetch<INotarialActionData>(
    `/api/dictionaries/notarial-action?actionType=typeNotarialAction`,
    "POST"
  );

  const { data: actionData } = useFetch<INotarialActionData>(
    `/api/dictionaries/notarial-action?actionType=action`,
    "POST"
  );

  const updateTempQueryParams = (key: keyof ITempQueryParams, newValue: ValueOf<ITempQueryParams>) => {
    setTempQueryParams((prev) => {
      return { ...prev, [key]: newValue };
    });
  };

  const handleFilterSubmit = async (value: IFilterSubmitParams) => {
    handleUpdateFilterValues(value);
    if (value.value.length > 0) updateTempQueryParams("page", 1);
  };

  const handlePageChange = (page: number) => {
    if (tempQueryParams.page !== page) updateTempQueryParams("page", page);
  };

  const handleUpdateFilterValues = (value: IFilterSubmitParams) => {
    const type = value.rowParams.colDef.filter?.type;
    if (type === "dictionary") {
      const field = value.rowParams.colDef.filter?.field;
      const prevValue = tempQueryParams.filterValues;

      if (field && Array.isArray(value.value)) {
        if (value.value.length > 0) {
          const updatedValues = value.value.map((item) => ({ id: item }));
          updateTempQueryParams("filterValues", {
            ...prevValue,
            [field]: updatedValues,
          });
        } else {
          const updatedFilterValues = { ...prevValue };
          delete updatedFilterValues[field];
          updateTempQueryParams("filterValues", updatedFilterValues);
        }
      }
    }
  };

  const handleSortByDate = async (model: GridSortModel) => {
    const sortBy = model.map((s) => (s.sort === "asc" ? s.field : `-${s.field}`));
    updateTempQueryParams("sortBy", sortBy);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value === "") {
      setTempQueryParams((prevParams) => ({
        ...prevParams,
        searchValue: "",
      }));
    }
    setSearchValue(value);
  };

  const handleSearchSubmit = () => {
    if (searchValue == null) return;
    setTempQueryParams((prevParams) => ({
      ...prevParams,
      page: 1,
      searchValue: searchValue,
    }));
  };

  const handleReset = () => {
    setSearchValue("");
    setTempQueryParams((prevParams) => ({
      ...prevParams,
      searchValue: "",
    }));
  };

  return (
    <>
      <Collapse in={alertOpen} sx={{ marginBottom: "10px", display: alertOpen ? "block" : "none" }}>
        <Alert severity="warning" onClose={() => setAlertOpen(false)}>
          {t("License has expired or is invalid")}
        </Alert>
      </Collapse>
      <Box height={{ xs: "600px", md: "700px" }} sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Typography variant="h4" color="success.main">
          {t("My templates")}
        </Typography>
        <SearchBar
          value={searchValue}
          onChange={handleSearchChange}
          onClick={handleSearchSubmit}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleReset} sx={{ visibility: searchValue === "" ? "hidden" : "visible" }}>
                <ClearIcon />
              </IconButton>
            ),
          }}
        />
        <Box>
          <GridTable
            columns={[
              {
                field: "id",
                headerName: "Template ID",
                width: 150,
              },
              {
                field: "name",
                headerName: "Template name",
                width: 340,
                sortable: false,
                valueGetter: (params: GridValueGetterParams) => {
                  return params.row.name;
                },
              },
              {
                field: "notaryObject",
                headerName: "Object",
                width: 320,
                sortable: false,
                filter: {
                  data: objectData?.data ?? [],
                  labelField: "nameIn" + capitalize(locale ?? ""),
                  valueField: "id",
                  type: "dictionary",
                  field: "object",
                },
                valueGetter: (params: GridValueGetterParams) => {
                  if (objectData?.data != null) {
                    const matchedItem = objectData?.data?.find(
                      (item: INotarialAction) => item.id == params.row.object?.id
                    );
                    const translatedTitle =
                      matchedItem?.[("nameIn" + capitalize(locale ?? "")) as keyof INotarialAction];
                    return !!translatedTitle ? translatedTitle : matchedItem?.["name" as keyof INotarialAction] ?? "";
                  }
                  return params.value;
                },
              },
              {
                field: "notaryObjectType",
                headerName: "Object type",
                width: 280,
                sortable: false,
                filter: {
                  data: objectTypeData?.data ?? [],
                  labelField: "nameIn" + capitalize(locale ?? ""),
                  valueField: "id",
                  type: "dictionary",
                  field: "objectType",
                },
                valueGetter: (params: GridValueGetterParams) => {
                  if (objectTypeData?.data != null) {
                    const matchedItem = objectTypeData?.data?.find(
                      (item: INotarialAction) => item.id == params.row.objectType?.id
                    );
                    const translatedTitle =
                      matchedItem?.[("nameIn" + capitalize(locale ?? "")) as keyof INotarialAction];
                    return !!translatedTitle ? translatedTitle : matchedItem?.["name" as keyof INotarialAction] ?? "";
                  }
                  return params.value;
                },
              },
              {
                field: "notaryAction",
                headerName: "Notarial action",
                width: 340,
                editable: false,
                sortable: false,
                filter: {
                  data: notarialActionData?.data ?? [],
                  labelField: "nameIn" + capitalize(locale ?? ""),
                  valueField: "id",
                  type: "dictionary",
                  field: "notarialAction",
                },
                valueGetter: (params: GridValueGetterParams) => {
                  if (notarialActionData?.data != null) {
                    const matchedItem = notarialActionData?.data.find(
                      (item: INotarialAction) => item.id == params.row.notarialAction?.id
                    );
                    const translatedTitle =
                      matchedItem?.[("nameIn" + capitalize(locale ?? "")) as keyof INotarialAction];
                    return !!translatedTitle ? translatedTitle : matchedItem?.["name" as keyof INotarialAction] ?? "";
                  }
                  return params.value;
                },
              },
              {
                field: "notaryActionType",
                headerName: "Action type",
                width: 200,
                editable: false,
                sortable: false,
                filter: {
                  data: typeNotarialActionData?.data ?? [],
                  labelField: "nameIn" + capitalize(locale ?? ""),
                  valueField: "id",
                  type: "dictionary",
                  field: "typeNotarialAction",
                },
                valueGetter: (params: GridValueGetterParams) => {
                  if (typeNotarialActionData?.data != null) {
                    const matchedItem = typeNotarialActionData?.data.find(
                      (item: INotarialAction) => item.id == params.row.typeNotarialAction?.id
                    );
                    const translatedTitle =
                      matchedItem?.[("nameIn" + capitalize(locale ?? "")) as keyof INotarialAction];
                    return !!translatedTitle ? translatedTitle : matchedItem?.["name" as keyof INotarialAction] ?? "";
                  }
                  return params.value;
                },
              },
              {
                field: "notaryRequestAction",
                headerName: "Purpose of action",
                width: 300,
                sortable: false,
                filter: {
                  data: actionData?.data ?? [],
                  labelField: "nameIn" + capitalize(locale ?? ""),
                  valueField: "id",
                  type: "dictionary",
                  field: "notaryAction",
                },
                valueGetter: (params: GridValueGetterParams) => {
                  if (actionData?.data != null) {
                    const matchedItem = actionData?.data?.find(
                      (item: INotarialAction) => item.id == params.row.notaryAction?.id
                    );
                    const translatedTitle =
                      matchedItem?.[("nameIn" + capitalize(locale ?? "")) as keyof INotarialAction];
                    return !!translatedTitle ? translatedTitle : matchedItem?.["name" as keyof INotarialAction] ?? "";
                  }
                  return params.value;
                },
              },
              {
                field: "actions",
                headerName: "Actions",
                headerClassName: "pinnable",
                sortable: false,
                width: 150,
                type: isMobileMedia ? "actions" : "string",
                cellClassName: isMobileMedia ? "actions-pinnable" : "actions-on-hover",
                renderCell: ({ row }) => (
                  <GridTableActionsCell row={row} onDelete={update} setAlertOpen={setAlertOpen} />
                ),
              },
            ]}
            rows={data?.data ?? []}
            onFilterSubmit={handleFilterSubmit}
            onSortModelChange={handleSortByDate}
            cellMaxHeight="200px"
            loading={loading}
            sx={{
              height: "100%",
              ".executorColumn": {
                color: "success.main",
              },
            }}
            rowHeight={65}
            autoHeight
          />
        </Box>

        <Pagination
          sx={{ display: "flex", justifyContent: "center" }}
          currentPage={tempQueryParams.page}
          totalPages={data?.total ? Math.ceil(data.total / tempQueryParams.pageSize) : 1}
          onPageChange={handlePageChange}
        />
      </Box>
    </>
  );
}
