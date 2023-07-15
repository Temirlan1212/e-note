import { useTranslations } from "next-intl";
import Button from "../ui/Button";
import Hint from "../ui/Hint";
import Input from "../ui/Input";

const EmailForm = () => {
  const t = useTranslations();
  return (
    <>
      <Hint type="hint">{t("To change your password, enter your E-mail, A reset link will be sent to it,")}</Hint>
      <Input
        label={"E-mail"}
        variant="outlined"
        color="success"
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
        name="email"
      />
      <Button type="submit" sx={{ padding: "10px 0", width: "100%" }} fullWidth color="success">
        {t("Send")}
      </Button>
    </>
  );
};

export default EmailForm;
