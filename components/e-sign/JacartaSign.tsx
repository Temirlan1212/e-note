import { Ref, forwardRef, useImperativeHandle, useState } from "react";
import { useTranslations } from "next-intl";
import useEffectOnce from "@/hooks/useEffectOnce";
import { Box, InputLabel, SelectChangeEvent } from "@mui/material";
import Select from "@/components/ui/Select";

type IWindow = Window &
  typeof globalThis & {
    JCWebClient2?: Record<string, any>;
  };

export interface IJacartaSignProps {
  base64Doc: string;
}

export interface IJacartaSignRef {
  handleSign: (callback?: (sign: string) => void) => string;
}

export default forwardRef(function JacartaSign({ base64Doc }: IJacartaSignProps, ref: Ref<IJacartaSignRef>) {
  const t = useTranslations();
  const [device, setDevice] = useState<number>();
  const [container, setContainer] = useState<number>();
  const [jc, setJc] = useState<Record<string, any>>();

  useEffectOnce(() => {
    const w = window as IWindow;
    if (w.JCWebClient2 != null) {
      w.JCWebClient2.initialize();
      setJc(w.JCWebClient2);
    }
  });

  useImperativeHandle(ref, () => ({
    handleSign,
  }));

  const handleSign: IJacartaSignRef["handleSign"] = (callback) => {
    if (jc == null) return;

    const authState = jc.getLoggedInState();
    if (authState?.state === 0) jc.bindToken({ args: { tokenID: device, useUI: true } });

    const sign = jc.signBase64EncodedData({
      args: {
        contID: container,
        data: base64Doc,
        attachedSignature: false,
        addSigningTime: true,
      },
    });

    if (authState?.state === 1) jc.unbindToken();

    if (callback != null) callback(sign);

    return sign;
  };

  return (
    <>
      <Box display="flex" flexDirection="column" my={2}>
        <InputLabel>{t("Device")}</InputLabel>
        <Select
          data={jc?.getAllSlots().map(({ id, device }: { id: number; device: { serialNumber: string } }) => ({
            label: `${id}_${device.serialNumber}`,
            value: id,
          }))}
          onChange={(event: SelectChangeEvent<number>) => {
            setDevice(event.target.value as number);
          }}
        />
      </Box>

      {device && (
        <Box display="flex" flexDirection="column" my={2}>
          <InputLabel>{t("Container")}</InputLabel>
          <Select
            data={jc?.getContainerList({ args: { tokenID: device } }).map((value: Record<string, any>) => ({
              ...value,
              label: `${value?.algorithm}: ${value?.description}`,
              value: value?.id,
            }))}
            onChange={(event: SelectChangeEvent<number>) => {
              setContainer(event.target.value as number);
            }}
          />
        </Box>
      )}
    </>
  );
});
