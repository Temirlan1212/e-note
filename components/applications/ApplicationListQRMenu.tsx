import { Box, CircularProgress, Divider, IconButton, Typography } from "@mui/material";
import { GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";
import { useState } from "react";
import useFetch from "@/hooks/useFetch";
import Menu from "@mui/material/Menu";
import { useTranslations } from "next-intl";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "@/components/ui/Link";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import DoneIcon from "@mui/icons-material/Done";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";

export const ApplicationListQRMenu = ({
  params,
}: {
  params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>;
}) => {
  const t = useTranslations();
  const [menu, setMenu] = useState<HTMLElement | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const open = !!menu;

  const { copied, copyToClipboard } = useCopyToClipboard({ resetDuration: 2000 });

  const { update: downloadUpdate, loading } = useFetch<Response>("", "GET", {
    returnResponse: true,
  });

  const { update: getDocument } = useFetch("", "POST");

  const handleCopyLinkClick = () => {
    if (!copied) copyToClipboard(`${window.location.href}/check-document/${params?.row?.uniqueQrCode ?? 0}`);
  };

  const handlePopupToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenu(menu == null ? event.currentTarget : null);
    if (!open) onPopupOpen();
  };

  const onPopupOpen = async () => {
    if (!Boolean(qrUrl) && params?.row?.uniqueQrCode != null) {
      const filesRes = await getDocument(`/api/files`, {
        filters: { fileName: `SaleOrderQRCode_${params?.row?.uniqueQrCode}` },
      });
      const fileId = filesRes?.data?.[0]?.id;
      if (fileId != null) {
        const res = await downloadUpdate(`/api/files/download/${fileId ?? 0}`);
        const blobData = await res.blob();
        const blobURL = URL.createObjectURL(blobData);
        setQrUrl(blobURL);
      }
    }
  };

  return (
    <Box display="flex" alignItems="center" gap="10px">
      <IconButton onClick={handlePopupToggle}>
        <QrCode2Icon color={open ? "success" : "inherit"} />
      </IconButton>

      <Menu anchorEl={menu} open={open} onClose={handlePopupToggle}>
        <Box display="flex" flexDirection="column" gap="10px" p="15px" alignItems="center">
          <Typography variant="h6"> {t("Scan the QR code")}</Typography>

          {loading ? (
            <CircularProgress />
          ) : qrUrl != null ? (
            <Image src={qrUrl ?? ""} width={170} height={170} alt="qr code" onError={() => setQrUrl(null)} />
          ) : (
            <Box py="20px" display="flex" flexDirection="column" alignItems="center">
              <BrokenImageIcon sx={{ width: 50, height: 50 }} />
              <Typography variant="h2">404</Typography>
            </Box>
          )}

          <Button endIcon={copied ? <DoneIcon /> : <CopyAllIcon />} onClick={handleCopyLinkClick}>
            {t("Copy link")}
          </Button>

          <Divider />
          <Box display="flex" flexDirection="column" gap="5px" width="100%">
            <Link href={`/applications/status/${params.row.id}`}>
              <Button>{t("More")}</Button>
            </Link>
            <Button buttonType="secondary" onClick={handlePopupToggle}>
              {t("Close")}
            </Button>
          </Box>
        </Box>
      </Menu>
    </Box>
  );
};