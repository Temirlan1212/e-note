import { useTranslations } from "next-intl";
import Hint from "../ui/Hint";
import Button from "../ui/Button";

const SuccessForm = () => {
  const t = useTranslations();
  return (
    <>
      <Hint title="Your password has been successfully changed" type="success">
        {t("Now you can enter your personal account")}
      </Hint>

      <Button type="submit" sx={{ padding: "10px 0", width: "100%" }} fullWidth color="success">
        {t("Enter")}
      </Button>
    </>
  );
};

export default SuccessForm;
