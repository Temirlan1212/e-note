import Box, { BoxProps } from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";
import Fab from "@mui/material/Fab";
import CheckIcon from "@mui/icons-material/Check";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { FC, PropsWithChildren } from "react";

interface IFingerprintScannerProps extends PropsWithChildren<BoxProps> {
  duration?: number;
  loading?: boolean;
  type?: "primary" | "error" | "success" | "signed";
}

const fullWidth = {
  width: "100%",
  height: "100%",
};

const state = {
  primary: {
    Icon: FingerprintIcon,
    text: "Confirm fingerprint",
  },

  loading: {
    Icon: FingerprintIcon,
    text: "Fingerprint verification",
  },

  error: {
    Icon: ErrorOutlineIcon,
    text: "Unable to identify fingerprint, Place your finger on the scanner again",
  },

  success: {
    Icon: CheckIcon,
    text: "Fingerprint verification successful",
  },

  signed: {
    Icon: CheckIcon,
    text: "Signed",
  },
};

const FingerprintScanner: FC<IFingerprintScannerProps> = ({ loading = false, type = "error", ...rest }) => {
  const t = useTranslations();
  const Icon = loading ? state["loading"].Icon : state[type].Icon;
  const text = loading ? state["loading"].text : state[type].text;
  const textColor = type === "error" && !loading ? type : "#687C9B";
  const fabColor = type === "signed" || loading ? "success" : type;

  return (
    <Box display="flex" px="5px" flexDirection="column" alignItems="center" width="fit-content" gap="50px 0" {...rest}>
      <Box margin={1} position="relative" width="100px" height="100px">
        <Fab color={fabColor} sx={{ p: "20px", ...fullWidth }}>
          <Icon sx={{ color: "white", ...fullWidth }} />
        </Fab>
        {loading && (
          <CircularProgress
            size={114}
            sx={{
              color: green[500],
              position: "absolute",
              top: -6,
              left: -6,
              zIndex: 1,
            }}
          />
        )}
      </Box>

      <Typography sx={{ whiteSpace: "wrap" }} textAlign={"center"} variant="h6" color={textColor}>
        {t(text)}
      </Typography>
    </Box>
  );
};

export default FingerprintScanner;
