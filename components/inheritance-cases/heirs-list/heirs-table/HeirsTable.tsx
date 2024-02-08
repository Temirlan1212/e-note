import React from "react";
import { GridTable, IGridColDef, IGridTableProps } from "@/components/ui/GridTable";
import { GridValueGetterParams } from "@mui/x-data-grid";
import { useTranslations } from "next-intl";
import { format, isValid } from "date-fns";
import { useMediaQuery } from "@mui/material";
import { TableActions } from "./components/ActionsTable";
import { ActualResidenceAddress } from "./components/ActualResidenceAddress";

interface HeirsTableProps extends Omit<IGridTableProps, "columns"> {}

const HeirsTable = React.forwardRef<HTMLDivElement, HeirsTableProps>(({ className, ...props }, ref) => {
  const isMobileMedia = useMediaQuery("(max-width:800px)");
  const t = useTranslations();

  const columns: IGridColDef[] = [
    {
      field: "requester.personalNumber",
      headerName: "PIN",
      width: 180,
      sortable: false,
    },
    {
      field: "requester.fullName",
      headerName: "Fullname",
      width: 320,
      sortable: false,
    },
    {
      field: "requester.relationships.relationshipType",
      headerName: "Family relationships",
      width: 250,
      sortable: false,
    },
    {
      field: "createdOn",
      headerName: "Date of application",
      width: 260,
      valueGetter: (params: GridValueGetterParams) => {
        if (!params.value) return t("absent");
        const date = new Date(params.value);
        return isValid(date) ? format(date, "dd.MM.yyyy HH:mm") : t("absent");
      },
      sortable: false,
    },
    {
      field: "requester.actualResidenceAddress.addressL2",
      headerName: "Address",
      width: 300,
      sortable: false,
      renderCell: (params) => ActualResidenceAddress(params),
    },
    {
      field: "requester.mobilePhone",
      headerName: "Phone number",
      width: 220,
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
      renderCell: (params) => <TableActions params={params} />,
    },
  ];

  return (
    <GridTable
      {...props}
      columns={columns}
      sx={{
        height: "100%",
        ".notaryColumn": {
          color: "success.main",
        },
      }}
      rowHeight={65}
      autoHeight
      cellMaxHeight="200px"
      loading={props.loading}
      rows={props?.rows ?? []}
    />
  );
});

HeirsTable.displayName = "HeirsTable";
export default HeirsTable;
