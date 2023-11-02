import { FC, useState } from "react";

import { useTranslations } from "next-intl";
import Link from "next/link";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import { Box, CircularProgress, Typography } from "@mui/material";

import Button from "@/components/ui/Button";
import ArchiveApplicationDocumentView from "./ArchiveApplicationDocumentView";
import useFetch from "@/hooks/useFetch";
import { useProfileStore } from "@/stores/profile";
import useEffectOnce from "@/hooks/useEffectOnce";

interface IApplicationStatusInfoContentProps {
  id?: number;
}

const ArchiveApplicationDocumentInfoContent: FC<IApplicationStatusInfoContentProps> = (props) => {
  const { id } = props;
  const t = useTranslations();

  const [accessToView, setAccessToView] = useState(false);

  const { data, update, loading } = useFetch("", "POST");

  const profile = useProfileStore((state) => state);

  useEffectOnce(() => {
    update(id != null ? `/api/applications-archive/${id}` : "", { fields: ["company"] }).then((res) => {
      if (res?.data?.[0] != null) {
        const currentUser = profile.getUserData()?.partner?.fullName;

        if (currentUser === res?.data?.[0]?.company) {
          update(`/api/applications-archive/${id}`);
          setAccessToView(true);
        }
      }
    });
  }, [accessToView]);

  return (
    <Box
      sx={{
        p: {
          xs: "10px",
          md: "40px",
        },
      }}
      display="flex"
      flexDirection="column"
      gap="40px"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          {t("Viewing a document")}
        </Typography>
        <Link href="/applications-archive">
          <Button
            variant="text"
            sx={{
              backgroundColor: "none",
              color: "#1BAA75",
              fontSize: "16px",
              width: "auto",
              ":hover": {
                backgroundColor: "transparent !important",
              },
            }}
            startIcon={<KeyboardBackspaceOutlinedIcon />}
          >
            {t("Back")}
          </Button>
        </Link>
      </Box>
      {data &&
        (accessToView ? (
          loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <ArchiveApplicationDocumentView data={data} />
          )
        ) : (
          <Typography>{t("You do not have access to view this document")}</Typography>
        ))}
    </Box>
  );
};

export default ArchiveApplicationDocumentInfoContent;
