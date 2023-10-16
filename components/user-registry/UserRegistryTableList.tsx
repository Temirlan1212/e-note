import React, { Dispatch, ReactNode, SetStateAction } from "react";

import { useTranslations } from "next-intl";

import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import Pagination from "../../components/ui/Pagination";
import { GridTable, IGridColDef } from "../../components/ui/GridTable";
import useFetch from "@/hooks/useFetch";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { GridRenderCellParams, GridSortModel } from "@mui/x-data-grid";
import { format } from "date-fns";
import { IUsersQueryParams } from "@/components/user-registry/UserRegistryContent";

interface IUserRegistryTableListProps {
  users: any | null;
  loading: boolean;
  handlePageChange: (page: number) => void;
  usersQueryParams: IUsersQueryParams;
  onDelete: () => void;
  onSortChange: (model: GridSortModel) => void;
}

export default function UserRegistryTableList({
  users,
  loading,
  usersQueryParams,
  handlePageChange,
  onDelete,
  onSortChange,
}: IUserRegistryTableListProps) {
  const t = useTranslations();

  const { update } = useFetch<Response>("", "POST", {
    returnResponse: true,
  });

  const columns: IGridColDef[] = [
    { field: "fullName", headerName: "User's full name", width: 280, sortable: true },
    { field: "user.roles.name", headerName: "User role", width: 160, sortable: false },
    { field: "user.code", headerName: "Login", width: 140, sortable: true },
    { field: "personalNumber", headerName: "TIN", width: 160, sortable: true },
    { field: "mobilePhone", headerName: "Phone Number", width: 180, sortable: true },
    { field: "user.email", headerName: "E-mail", width: 220, sortable: true },
    {
      field: "createdOn",
      headerName: "Date and time of registration",
      width: 220,
      sortable: true,
      renderCell: (params: GridRenderCellParams): ReactNode => format(new Date(params.value), "dd.MM.yyyy HH:mm:ss"),
    },
    { field: "emailAddress.address", headerName: "Registered by whom", width: 200, sortable: true },
    {
      field: "actions",
      headerName: "Action",
      type: "actions",
      sortable: false,
      width: 120,
      cellClassName: "actions-pinnable",
      renderCell: (params: GridRenderCellParams) => {
        const handleDeleteClick = async (callback: Dispatch<SetStateAction<boolean>>) => {
          if (params.row?.["user.id"] != null) {
            await update("/api/user/delete/" + params.row?.["user.id"] + "?version=" + params.row?.["user.version"]);
            callback(false);
            onDelete();
          }
        };
        return (
          <Box
            sx={{
              background: "transparent !important",
              display: "flex",
            }}
          >
            <Tooltip title={t("Password Reset")}>
              <IconButton
                sx={{
                  "&:hover, &.Mui-focusVisible": { color: "#1BAA75" },
                }}
              >
                <RefreshRoundedIcon />
              </IconButton>
            </Tooltip>
            <ConfirmationModal
              hintTitle="Do you really want to delete a user?"
              title="Deleting a user"
              onConfirm={(callback) => handleDeleteClick(callback)}
            >
              <Tooltip title={t("Delete a user")}>
                <IconButton
                  sx={{
                    "&:hover, &.Mui-focusVisible": { color: "#1BAA75" },
                  }}
                >
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </Tooltip>
            </ConfirmationModal>
          </Box>
        );
      },
    },
  ];

  const dataGridStyles = {
    ".MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell": { padding: "10px 16px" },
    ".MuiDataGrid-row": { "&:hover": { "& .MuiIconButton-root": { visibility: "visible" } } },
    ".MuiDataGrid-columnHeader": { padding: "16px" },
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Box>
          <GridTable
            loading={loading}
            rows={users?.data!}
            columns={columns}
            sx={dataGridStyles}
            onSortModelChange={onSortChange}
          />
        </Box>
      </Box>

      <Box alignSelf="center">
        <Pagination
          currentPage={usersQueryParams.page}
          totalPages={users?.total ? Math.ceil(users.total / usersQueryParams.pageSize) : 1}
          onPageChange={handlePageChange}
        />
      </Box>
    </>
  );
}
