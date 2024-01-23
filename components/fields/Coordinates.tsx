import { Dispatch, SetStateAction, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

import {
  InputLabel,
  Box,
  SxProps,
  Theme,
  IconButton,
  Typography,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { IMarker } from "@/components/ui/LeafletMap";
import MapIcon from "@mui/icons-material/Map";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import useNotificationStore from "@/stores/notification";

export interface ICoordinatesProps {
  form: UseFormReturn<any>;
  names: {
    latitude: string;
    longitude: string;
  };
  defaultValues?: {
    latitude?: string;
    longitude?: string;
  };
  disableFields?: boolean;
  maxLength?: number;
  sx?: {
    boxSx?: SxProps<Theme>;
    labelsSx?: SxProps<Theme>;
  };
  withMap?: boolean;
}

export default function Coordinates({
  form,
  names,
  defaultValues,
  disableFields,
  maxLength,
  withMap,
  sx,
}: ICoordinatesProps) {
  const LeafletMap = dynamic(
    () => {
      return import("@/components/ui/LeafletMap");
    },
    { loading: () => <CircularProgress />, ssr: false }
  );

  const t = useTranslations();
  const isMobileMedia = useMediaQuery("(max-width:800px)");
  const setNotification = useNotificationStore((state) => state.setNotification);

  const { trigger, control, watch, resetField, setValue } = form;

  const longitude = watch(names.longitude);
  const latitude = watch(names.latitude);

  const [options, setOptions] = useState<{ lat: number; lng: number; zoom: number } | null>(null);

  const handleSetCoordinates = (data: { lat: number; lng: number }) => {
    const formattedLat = data?.lat?.toFixed(6);
    const formattedLng = data?.lng?.toFixed(6);

    setValue(names.latitude, formattedLat);
    setValue(names.longitude, formattedLng);
  };

  const handleConfirmClick = (callback: Dispatch<SetStateAction<boolean>>) => {
    if (options) {
      handleSetCoordinates(options);
    }
    callback(false);
  };

  const handleRejectClick = () => {
    setOptions(null);
    resetField(names.latitude);
    resetField(names.longitude);
  };

  const handleCoordinatesChange = (newOptions: { lat: number; lng: number; zoom: number }) => {
    setOptions(newOptions);
    handleSetCoordinates(newOptions);
  };

  const markers: IMarker[] =
    options || (latitude && longitude)
      ? [
          {
            coordinates: {
              lat: latitude ?? options?.lat.toString(),
              lng: longitude ?? options?.lng.toString(),
              zoom: options?.zoom ?? 12,
            },
          },
        ]
      : [];

  const markerCenter: [number, number] =
    longitude && latitude
      ? [parseFloat(latitude as string), parseFloat(longitude as string)]
      : [42.8777895, 74.6066926];

  const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleCoordinatesChange({
          lat: position?.coords?.latitude,
          lng: position?.coords?.longitude,
          zoom: options?.zoom ?? 12,
        });
      },
      (error) => {
        setNotification(t("The website is denied access to the location or another error occurred") ?? null);
      }
    );
  };

  return (
    <Box sx={sx?.boxSx} display="flex" gap="20px" flexDirection="column">
      {withMap && (
        <ConfirmationModal
          title="Specify coordinates to display them on the map"
          onConfirm={(callback) => handleConfirmClick(callback)}
          handleReject={handleRejectClick}
          isHintShown={false}
          confirmButtonText="Set"
          confirmButtonType="primary"
          rejectButtonText="Cancel"
          slots={{
            body: () => {
              return (
                <Box>
                  <Button
                    onClick={getUserCoordinates}
                    sx={{ display: "flex", gap: "7px", fontSize: { xs: "14px", md: "unset" } }}
                  >
                    <GpsFixedIcon />
                    {t("Specify my location")}
                  </Button>
                  <LeafletMap
                    zoom={options?.zoom ?? 12}
                    markers={markers}
                    center={markerCenter}
                    isSearchCoordinates={true}
                    onCoordinatesChange={handleCoordinatesChange}
                    style={{
                      height: "500px",
                      width: isMobileMedia ? "unset" : "1000px",
                      margin: "auto",
                    }}
                  />
                </Box>
              );
            },
          }}
        >
          <Button
            startIcon={<MapIcon />}
            color="primary"
            variant="contained"
            sx={{
              width: "fit-content",
            }}
          >
            {t("Open map")}
          </Button>
        </ConfirmationModal>
      )}

      <Box display="flex" gap="20px" flexDirection={{ xs: "column", md: "row" }}>
        <Controller
          control={control}
          name={names.latitude}
          defaultValue={defaultValues?.latitude ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel sx={sx?.labelsSx}>{t("Latitude")}</InputLabel>
              <Input
                disabled={disableFields}
                inputProps={{ maxLength: maxLength || undefined }}
                placeholder={"0.000000"}
                inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                onInput={(...event: any[]) => {
                  field.onChange(...event);
                  trigger(field.name);
                }}
                {...field}
              />
            </Box>
          )}
        />
        <Controller
          control={control}
          name={names.longitude}
          defaultValue={defaultValues?.longitude ?? ""}
          render={({ field, fieldState }) => (
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel sx={sx?.labelsSx}>{t("Longitude")}</InputLabel>
              <Input
                disabled={disableFields}
                inputProps={{ maxLength: maxLength || undefined }}
                placeholder={"0.000000"}
                inputType={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                onInput={(...event: any[]) => {
                  field.onChange(...event);
                  trigger(field.name);
                }}
                {...field}
              />
            </Box>
          )}
        />
      </Box>
    </Box>
  );
}
