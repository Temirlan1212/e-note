import { useState } from "react";
import { useTranslations } from "next-intl";
import useEffectOnce from "@/hooks/useEffectOnce";
import { Box, InputLabel, SelectChangeEvent } from "@mui/material";
import Select from "@/components/ui/Select";

type IWindow = Window &
  typeof globalThis & {
    JCWebClient2?: Record<string, any>;
  };

export default function JacartaSign({ base64Doc, onSign }: { base64Doc: string; onSign: (sign: string) => void }) {
  const t = useTranslations();
  const [sign, setSign] = useState<any>();
  const [jcData, setJcData] = useState<Record<string, any> | null>(null);

  useEffectOnce(() => {
    const w = window as IWindow;
    if (w.JCWebClient2 != null) {
      w.JCWebClient2?.initialize();

      setJcData({
        jc: w.JCWebClient2,
        slots: w.JCWebClient2.getAllSlots().map(({ id, device }: { id: number; device: { serialNumber: string } }) => ({
          label: `${id}_${device.serialNumber}`,
          value: id,
        })),
      });
    }
  });

  useEffectOnce(() => {
    if (sign == null) return;
    onSign(sign);
  }, [sign]);

  return (
    <>
      <Box display="flex" flexDirection="column" my={2}>
        <InputLabel>{t("Device")}</InputLabel>
        <Select
          data={jcData?.slots}
          onChange={(event: SelectChangeEvent<number>) => {
            setJcData((prev) => ({
              ...prev,
              tokenID: event.target.value ? event.target.value : null,
              containers: event.target.value
                ? jcData?.jc
                    .getContainerList({ args: { tokenID: event.target.value } })
                    .map((value: Record<string, any>) => ({
                      ...value,
                      label: `${value?.algorithm}: ${value?.description}`,
                      value: value?.id,
                    }))
                : null,
            }));
          }}
        />
      </Box>

      {jcData?.tokenID && (
        <Box display="flex" flexDirection="column" my={2}>
          <InputLabel>{t("Container")}</InputLabel>
          <Select
            data={jcData?.containers}
            onChange={(event: SelectChangeEvent<number>) => {
              const authState = jcData?.jc.getLoggedInState();
              if (authState?.state === 0) {
                jcData?.jc.bindToken({
                  args: {
                    tokenID: jcData?.tokenID,
                    useUI: true,
                  },
                });
              }

              setSign(
                jcData?.jc.signBase64EncodedData({
                  args: {
                    contID: event.target.value,
                    data: base64Doc,
                    attachedSignature: false,
                    addSigningTime: true,
                  },
                })
              );

              if (authState?.state === 1) {
                jcData?.jc.unbindToken();
              }
            }}
          />
        </Box>
      )}
    </>
  );
}
