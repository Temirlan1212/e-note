import { useTranslations } from "next-intl";
import Hint from "../ui/Hint";
import Button from "../ui/Button";
import { Box } from "@mui/material";

const SuccessForm = () => {
  const t = useTranslations();

  return (
    <Box
      sx={{
        padding: "30px 20px",
        maxWidth: "520px",
        margin: "0 auto",
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 5px 20px 0px #E9E9E9",
        display: "flex",
        flexDirection: "column",
        gap: "30px",
      }}
    >
      <Hint title="Your password has been successfully changed" type="success">
        {t("Now you can enter your personal account")}
      </Hint>

      <Button type="submit" sx={{ padding: "10px 0", width: "100%" }} fullWidth color="success">
        {t("Enter")}
      </Button>
    </Box>
  );
};

export default SuccessForm;
