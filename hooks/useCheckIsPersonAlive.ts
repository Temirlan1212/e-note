import useNotificationStore from "@/stores/notification";
import useFetch from "./useFetch";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";

export type CheckProps = {
  notify: boolean;
  form: {
    values: Record<string, any>;
    onError?: (name: string) => void;
  };
};

export const useCheckIsPersonAlive = () => {
  const { data, update, loading } = useFetch("", "POST");
  const setNotification = useNotificationStore((state) => state.setNotification);
  const t = useTranslations();

  const checkWithFormBind = async (props: CheckProps["form"]) => {
    const onError = props?.onError;
    const values = props?.values;

    if (!values) throw new Error("provide params");

    for (let name in values) {
      const pin = values?.[name];
      if (!!pin) {
        const isPersonAlive = await check(pin, false);
        if (!isPersonAlive) {
          onError && onError(name);
          return false;
        }
      }
    }
    return true;
  };

  const check = async (pin: string, notify?: CheckProps["notify"]) => {
    const res: Record<string, any> = await update(`/api/tunduk`, {
      model: `/ws/tunduk/person/${pin}`,
    });
    const deathDate = res?.data?.deathDate;
    if (!!deathDate) {
      if (notify) setNotification(t("The person not alive on this PIN") ?? null);
      return false;
    } else return true;
  };

  return { check, checkWithFormBind, loading, data };
};
