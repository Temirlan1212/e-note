import { KeyboardArrowUp } from "@mui/icons-material";
import { Box, Fab, Zoom, useScrollTrigger, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

export default function ScrollToTopFab() {
  const t = useTranslations();

  const trigger = useScrollTrigger({
    threshold: 100,
  });
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <Zoom in={trigger}>
      <Box
        role="presentation"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1,
        }}
      >
        <Tooltip title={t("Scroll to top")} arrow>
          <Fab onClick={scrollToTop} color="primary" size="small" aria-label="Scroll back to top">
            <KeyboardArrowUp fontSize="medium" />
          </Fab>
        </Tooltip>
      </Box>
    </Zoom>
  );
}
