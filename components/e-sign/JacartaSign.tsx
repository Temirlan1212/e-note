import { Ref, forwardRef, useImperativeHandle, useState } from "react";
import Script from "next/script";
import { useTranslations } from "next-intl";
import useEffectOnce from "@/hooks/useEffectOnce";
import { Box, InputLabel, SelectChangeEvent } from "@mui/material";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import { SignType, getJacartaErrorReason } from "./_helpers";

type IWindow = Window &
  typeof globalThis & {
    JCWebClient2?: Record<string, any>;
  };

export interface IJacartaSignProps {
  base64Doc: string;
}

export interface IJacartaSignRef {
  handleSign: (callback?: (sign: string) => Promise<boolean>) => Promise<boolean>;
}

export default forwardRef(function JacartaSign({ base64Doc }: IJacartaSignProps, ref: Ref<IJacartaSignRef>) {
  const t = useTranslations();
  const [devices, setDevices] = useState<Record<string, any>[]>();
  const [device, setDevice] = useState<number>(-1);
  const [container, setContainer] = useState<number>(-1);
  const [pin, setPin] = useState<string>("");
  const [lib, setLib] = useState<Record<string, any>>();

  useEffectOnce(() => {
    handleLoad();
  });

  useEffectOnce(async () => {
    if (lib == null) return;

    const devices = lib.getAllSlots();

    const tmpDevices = await Promise.all(
      devices.map(async (item: Record<string, any>) => {
        const containers = lib.getContainerList({ args: { tokenID: item.id } });

        return {
          label: `${item.id}_${item.device.serialNumber}`,
          value: item.id,
          containers: containers.map((container: Record<string, any>) => ({
            label: `${container.algorithm}: ${container.description}`,
            value: container.id,
          })),
        };
      })
    );

    setDevices(tmpDevices);
  }, [lib]);

  useImperativeHandle(ref, () => ({
    handleSign,
  }));

  const handleLoad = () => {
    if (lib != null) return;

    const w = window as IWindow;
    const timer = setInterval(() => {
      if (w.JCWebClient2 != null) {
        w.JCWebClient2.initialize();
        setLib(w.JCWebClient2);
        clearInterval(timer);
      }
    }, 1000);
  };

  const handleSign: IJacartaSignRef["handleSign"] = async (callback) => {
    if (lib == null) return false;

    try {
      const authState = lib.getLoggedInState();
      if (authState?.state === 0) lib.bindToken({ args: { tokenID: device, pin } });

      const sign: string | null = lib.signBase64EncodedData({
        args: {
          contID: container,
          data: base64Doc,
          attachedSignature: false,
          addSigningTime: true,
        },
      });

      if (authState?.state === 1) lib.unbindToken();

      if (callback != null && sign != null) return await callback(sign);
    } catch (error: any) {
      const code = Number(error?.code);
      if (!isNaN(code)) {
        throw { ...getJacartaErrorReason(code), type: SignType.Jacarta };
      }
    }

    return false;
  };

  return (
    <>
      <Script id="JCWebClient" strategy="afterInteractive">
        {`(function (url = "https://localhost:24738/JCWebClient.js") {
              var parent = document.getElementsByTagName("body")[0];
              var script = document.createElement("script");
              script.type = "text/javascript";
              script.src = url;
              parent.appendChild(script);
            })();`}
      </Script>

      <Box display="flex" flexDirection="column" my={2}>
        <InputLabel>{t("Device")}</InputLabel>
        <Select
          value={device}
          data={devices ?? []}
          onChange={(event: SelectChangeEvent<number>) => {
            setDevice(event.target.value as number);
            setContainer(-1);
            setPin("");
          }}
        />
      </Box>

      {device !== -1 && (
        <Box display="flex" flexDirection="column" my={2}>
          <InputLabel>{t("Container")}</InputLabel>
          <Select
            value={container}
            data={devices?.find((item) => item.value === device)?.containers ?? []}
            onChange={(event: SelectChangeEvent<number>) => {
              setContainer(event.target.value as number);
              setPin("");
            }}
          />
        </Box>
      )}

      {container !== -1 && (
        <Box display="flex" flexDirection="column" my={2}>
          <InputLabel>{t("PIN code")}</InputLabel>
          <Input type="password" value={pin} onChange={(event) => setPin(event.target.value)} />
        </Box>
      )}
    </>
  );
});
