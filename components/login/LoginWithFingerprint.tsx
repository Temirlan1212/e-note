import { Box, IconButton, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Hint from "../ui/Hint";
import Button from "../ui/Button";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import { useState } from "react";

const LoginWithFingerprint: React.FC = () => {
  const [state, setState] = useState<"loading" | "error" | "success">("success");
  const t = useTranslations();

  function switchInfo() {
    switch (state) {
      case "loading":
        return t("Fingerprint verification");
      case "error":
        return t("Unable to identify fingerprint, Place your finger on the scanner again");
      case "success":
        return t("Fingerprint verification successful");
    }
  }

  return (
    <Box>
      {state === "error" ? (
        <Hint title="Unsuccessful login attempt" type="error" sx={{ mb: "20px" }}></Hint>
      ) : (
        <Hint type="hint" sx={{ mb: "20px" }}>
          {t("You need to verify your fingerprint to sign in")}
        </Hint>
      )}

      <Box display="flex" flexDirection="column" gap="20px">
        <IconButton
          sx={{
            width: "100px",
            height: "100px",
            m: "30px auto",
            bgcolor: state === "error" ? "#EB5757" : "success.main",
          }}
        >
          {state === "loading" ? (
            <FingerprintIcon sx={{ fontSize: "42px", color: "white" }} />
          ) : state === "error" ? (
            <ClearIcon sx={{ fontSize: "50px", color: "white", strokeWidth: "3px" }} />
          ) : (
            <DoneIcon sx={{ fontSize: "42px", color: "white" }} />
          )}
        </IconButton>
        <Typography textAlign={"center"} variant="h6" color={"#687C9B"}>
          {switchInfo()}
        </Typography>
        <Button
          disabled
          type="submit"
          sx={{
            padding: "10px 0",
            width: "100%",
            mt: "10px",
            "&.Mui-disabled": {
              opacity: 0.5,
              bgcolor: "#1BAA75",
              color: "white",
            },
          }}
          fullWidth
          color="success"
        >
          {t("Login")}
        </Button>
      </Box>
    </Box>
  );
};

export default LoginWithFingerprint;
