import { Ref, forwardRef, useImperativeHandle, useState } from "react";
import { useTranslations } from "next-intl";
import useEffectOnce from "@/hooks/useEffectOnce";
import { Box, InputLabel, SelectChangeEvent } from "@mui/material";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";

export interface IRutokenSignProps {
  base64Doc: string;
}

export interface IRutokenSignRef {
  handleSign: (callback?: (sign: string) => void) => Promise<string | null>;
}

export default forwardRef(function RutokenSign({ base64Doc }: IRutokenSignProps, ref: Ref<IRutokenSignRef>) {
  const t = useTranslations();
  const [devices, setDevices] = useState<Record<string, any>[]>();
  const [device, setDevice] = useState<number>(-1);
  const [certificate, setCertificate] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [lib, setLib] = useState<Record<string, any>>();

  useEffectOnce(() => {
    handleLoad();
  });

  useEffectOnce(async () => {
    if (lib == null) return;

    const devices = await lib.enumerateDevices({ mode: lib.ENUMERATE_DEVICES_LIST });

    const tmpDevices = await Promise.all(
      devices.map(async (item: number) => {
        const certificates = await lib.enumerateCertificates(item, lib.CERT_CATEGORY_USER);

        return {
          label:
            (await lib.getDeviceInfo(item, lib.TOKEN_INFO_MODEL)) +
            "_" +
            (await lib.getDeviceInfo(item, lib.TOKEN_INFO_SERIAL)),
          value: item,
          certificates: certificates.map((certificate: string) => ({ label: certificate, value: certificate })),
        };
      })
    );

    setDevices(tmpDevices);
  }, [lib]);

  useImperativeHandle(ref, () => ({
    handleSign,
  }));

  const handleLoad = async () => {
    const rt = require("@aktivco/rutoken-plugin/rutoken-plugin.min");

    if (rt != null && (await rt?.ready) && (await rt?.isExtensionInstalled()) && (await rt?.isPluginInstalled())) {
      setLib(await rt?.loadPlugin());
    }
  };

  const handleSign: IRutokenSignRef["handleSign"] = async (callback) => {
    if (lib == null) return null;

    const authState = await lib.getDeviceInfo(device, lib.TOKEN_INFO_IS_LOGGED_IN);
    if (!authState) await lib.login(device, pin);

    const sign: string | null = await lib.sign(device, certificate, base64Doc, lib.DATA_FORMAT_BASE64, {
      detached: true,
      addSignTime: true,
    });

    if (authState) await lib.logout(device);

    if (callback != null && sign != null) callback(sign);

    return sign;
  };

  return (
    <>
      <Box display="flex" flexDirection="column" my={2}>
        <InputLabel>{t("Device")}</InputLabel>
        <Select
          value={device}
          data={devices ?? []}
          onChange={(event: SelectChangeEvent<number>) => {
            setDevice(event.target.value as number);
            setCertificate("");
            setPin("");
          }}
        />
      </Box>

      {device !== -1 && (
        <Box display="flex" flexDirection="column" my={2}>
          <InputLabel>{t("Certificate")}</InputLabel>
          <Select
            value={certificate}
            data={devices?.find((item) => item.value === device)?.certificates ?? []}
            onChange={(event: SelectChangeEvent<string>) => {
              setCertificate(event.target.value);
              setPin("");
            }}
          />
        </Box>
      )}

      {certificate !== "" && (
        <Box display="flex" flexDirection="column" my={2}>
          <InputLabel>{t("PIN code")}</InputLabel>
          <Input type="password" value={pin} onChange={(event) => setPin(event.target.value)} />
        </Box>
      )}
    </>
  );
});
