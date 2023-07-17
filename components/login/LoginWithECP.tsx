import { Box, IconButton, InputAdornment, Typography } from "@mui/material";

import Hint from "../ui/Hint";
import Link from "../ui/Link";
import { useTranslations } from "next-intl";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ReplayIcon from "@mui/icons-material/Replay";
import Select from "../ui/Select";

const LoginWithECP: React.FC = () => {
  const t = useTranslations();

  return (
    <Box>
      <Hint title="Extension “Adapter Rutoken Plugin” is not installed" type="error">
        {t("You can download it from ")}
        <Link sx={{ textDecoration: "underline" }} color="success.main" href={"#"}>
          {t("this link")}
        </Link>
      </Hint>

      <Box mt={"30px"} component="form" onSubmit={(e) => e.preventDefault()}>
        <Box display="flex" flexDirection="column" gap="20px">
          <Box>
            <Typography mb={"5px"} variant="h6" fontSize={"14px"} fontWeight={500}>
              {t("Available Devices")}
            </Typography>
            <Select
              placeholder="select"
              data={[{ value: "1", label: t("Choose a device") }]}
              defaultValue={"1"}
            ></Select>
            <Button
              sx={{ p: 0, mt: "10px", textAlign: "left", fontSize: "14px", width: "fit-content" }}
              variant="text"
              color="success"
              startIcon={<ReplayIcon />}
            >
              {t("Refresh device list")}
            </Button>
          </Box>
          <Box>
            <Typography mb={"5px"} variant="h6" fontSize={"14px"} fontWeight={500}>
              {t("Certificates on the device")}
            </Typography>
            <Select data={[{ value: "1", label: t("Choose a certificate") }]} defaultValue={"1"}></Select>
            <Button
              sx={{ p: 0, mt: "10px", mb: "20px", textAlign: "left", fontSize: "14px", width: "fit-content" }}
              variant="text"
              color="success"
              startIcon={<ReplayIcon />}
            >
              {t("Update list of certificates")}
            </Button>
          </Box>
          <Input
            type="number"
            label={t("Pin")}
            variant="outlined"
            color="success"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            name="INN"
          />
          <Input
            label={t("Personal number (TIN)")}
            variant="outlined"
            color="success"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            name="INN"
          />

          <Button type="submit" sx={{ padding: "10px 0", width: "100%", mt: "10px" }} fullWidth color="success">
            {t("Enter")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginWithECP;
