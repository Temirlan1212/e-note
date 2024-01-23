import React, { Dispatch, SetStateAction, useState } from "react";

import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { format, isValid } from "date-fns";
import useEffectOnce from "@/hooks/useEffectOnce";
import { Controller, UseFormReturn, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { IProfileState, useProfileStore } from "@/stores/profile";
import { IWorkingDaysSchema, workingDaysSchema } from "@/validator-schemas/profile";
import { Box, IconButton, InputLabel, Tooltip, Typography } from "@mui/material";
import { GridValueGetterParams } from "@mui/x-data-grid";
import Button from "@/components/ui/Button";
import TimePicker from "@/components/ui/TimePicker";
import { GridTable } from "@/components/ui/GridTable";
import Autocomplete from "@/components/ui/Autocomplete";
import { getLabelField } from "@/components/notaries/NotariesFilterForm";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import WorkMode from "@/components/fields/WorkMode";
import AddIcon from "@mui/icons-material/Add";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

interface IWorkingDay {
  order_seq: number;
  title_fr: string;
  title_en: string;
  title_ru: string;
  title: string;
  value: string;
  id?: number;
}

interface IProfileWorkingDaysProps {
  profileForm: UseFormReturn<any>;
  names?: {
    roundClock: string;
    departure: string;
  };
}

function GridTableActionsCell({
  row,
  onRefresh,
  dictionary,
  form,
}: {
  row: Record<string, any>;
  onRefresh: () => void;
  dictionary: FetchResponseBody | null;
  form: UseFormReturn<any>;
}) {
  const t = useTranslations();

  const { locale } = useRouter();

  const { update: deleteWorkingDay } = useFetch("", "DELETE");
  const { update: editWorkingDay } = useFetch("", "POST");

  const {
    formState: { errors },
    getValues,
    setValue,
    control,
    trigger,
  } = form;

  const workingDayIndex = getValues("workingDays").findIndex((item: any) => item.id === row.id);

  const handleDeleteClick = async (callback: Dispatch<SetStateAction<boolean>>) => {
    if (row.id != null) {
      await deleteWorkingDay("/api/profile/working-day/delete/" + row.id);
      callback(false);
      onRefresh();
    }
  };

  const handleEditClick = async (callback: Dispatch<SetStateAction<boolean>>) => {
    if (row.id != null) {
      const formValues = getValues(`workingDays[${workingDayIndex}]`);
      const { startWorkingDay, endWorkingDay, weekDayNumber } = formValues;
      if (weekDayNumber && startWorkingDay && endWorkingDay) {
        const version = row?.version;
        const dayOfWeek = weekDayNumber ? parseInt(weekDayNumber) : row?.weekDayNumber;
        const startTime =
          startWorkingDay && isValid(new Date(startWorkingDay))
            ? format(new Date(startWorkingDay), "HH:mm")
            : row?.startDate?.slice(0, 8);
        const endTime =
          endWorkingDay && isValid(new Date(endWorkingDay))
            ? format(new Date(endWorkingDay), "HH:mm")
            : row?.endDate?.slice(0, 8);

        const params = {
          weekDayNumber: dayOfWeek,
          endWorkingDay: endTime,
          startWorkingDay: startTime,
          version: version,
          id: row.id,
        };
        await editWorkingDay("/api/profile/working-day/edit/" + row.id, {
          body: params,
        });
        callback(false);
        onRefresh();
      }
    }
  };

  useEffectOnce(() => {
    const endDate = new Date();
    endDate.setHours(row?.endDate?.slice(0, 2));
    endDate.setMinutes(row?.endDate?.slice(3, 5));
    const startDate = new Date();
    startDate.setHours(row?.startDate?.slice(0, 2));
    startDate.setMinutes(row?.startDate?.slice(3, 5));
    setValue(`workingDays[${workingDayIndex}].startWorkingDay`, startDate);
    setValue(`workingDays[${workingDayIndex}].endWorkingDay`, endDate);
  }, [row]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <ConfirmationModal
        title={"Edit a working day"}
        onConfirm={(callback) => handleEditClick(callback)}
        isHintShown={false}
        isCloseIconShown={true}
        confirmButtonType="primary"
        slots={{
          body: () => {
            return (
              <Box display="flex" flexDirection="row" gap="15px" marginBottom="25px" flexWrap="wrap">
                <Controller
                  control={control}
                  name={`workingDays[${workingDayIndex}].weekDayNumber`}
                  defaultValue={null}
                  render={({ field, fieldState }) => (
                    <Box display="flex" flexDirection="column" width="100%" gap="10px">
                      <InputLabel>{t("Day of the week")}</InputLabel>
                      <Autocomplete
                        labelField={getLabelField(dictionary, locale as string)}
                        type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                        helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                        options={dictionary?.status === 0 ? (dictionary?.data as Record<string, any>[]) ?? [] : []}
                        textFieldPlaceholder={"---"}
                        value={
                          field.value != null
                            ? (dictionary?.data ?? []).find(
                                (item: Record<string, any>) =>
                                  item?.value == row?.weekDayNumber ?? field.value?.weekDayNumber
                              ) ?? null
                            : null
                        }
                        onBlur={field.onBlur}
                        onChange={(event, value) => {
                          field.onChange(value?.value != null ? { ...field.value, weekDayNumber: value?.value } : null);
                        }}
                        disabled={row?.weekDayNumber ? true : false}
                      />
                    </Box>
                  )}
                />
                <Controller
                  control={control}
                  name={`workingDays[${workingDayIndex}].startWorkingDay`}
                  defaultValue={null}
                  render={({ field, fieldState }) => (
                    <Box display="flex" flexDirection="column" width="100%" gap="10px">
                      <InputLabel>{t("startWorkingDay")}</InputLabel>
                      <TimePicker
                        type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                        value={field.value != null ? field.value : null}
                        helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                        onChange={(value: Date) => {
                          field.onChange(value != null ? value : null);
                          trigger(field.name);
                        }}
                      />
                    </Box>
                  )}
                />
                <Controller
                  control={control}
                  name={`workingDays[${workingDayIndex}].endWorkingDay`}
                  defaultValue={null}
                  render={({ field, fieldState }) => (
                    <Box display="flex" flexDirection="column" width="100%" gap="10px">
                      <InputLabel>{t("endWorkingDay")}</InputLabel>
                      <TimePicker
                        type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                        value={field.value != null ? field.value : null}
                        helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                        onChange={(value: Date) => {
                          field.onChange(value != null ? value : null);
                          trigger(field.name);
                        }}
                      />
                    </Box>
                  )}
                />
              </Box>
            );
          },
        }}
      >
        <Tooltip title={t("Edit")} arrow>
          <IconButton>
            <ModeEditIcon />
          </IconButton>
        </Tooltip>
      </ConfirmationModal>

      <ConfirmationModal
        hintTitle="Do you really want to remove the working day?"
        title="Deleting a working day"
        onConfirm={(callback) => handleDeleteClick(callback)}
      >
        <Tooltip title={t("Delete")} arrow>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </ConfirmationModal>
    </Box>
  );
}

const ProfileWorkingDays: React.FC<IProfileWorkingDaysProps> = ({ profileForm, names }) => {
  const t = useTranslations();

  const { locale } = useRouter();

  const profile = useProfileStore<IProfileState>((state) => state);
  const profileData: any = profile.getUserData();

  const [workingDays, setWorkingDays] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: workDaysDictionary } = useFetch<FetchResponseBody | null>(
    "/api/notaries/dictionaries/work-days",
    "POST"
  );

  const { update: getWorkingDay, loading: workingDaysLoading } = useFetch("", "GET");

  const { update: createWorkingDay } = useFetch("", "PUT");

  const { data: userData, update: getUserData, loading: userDataLoading } = useFetch("", "POST");

  const refreshData = async () => {
    await getUserData(profileData?.id != null ? "/api/profile/user/" + profileData?.id : "", {
      userRole: profileData?.activeCompany ? "notary" : "declarant",
    });
  };

  useEffectOnce(async () => {
    await refreshData();
  });

  useEffectOnce(async () => {
    if (userData) {
      const workingDaysPromises = userData?.data?.[0]?.activeCompany?.workingDay.map((workingDay: IWorkingDay) =>
        getWorkingDay("/api/profile/working-day/" + workingDay.id)
      );
      const workingDaysData = await Promise.all(workingDaysPromises);
      setWorkingDays(workingDaysData.map((day) => day?.data?.[0]));
    }
  }, [userData]);

  const form = useForm<IWorkingDaysSchema>({
    resolver: yupResolver(workingDaysSchema as any),
    values: {
      workingDays: workingDays != null ? workingDays : null,
      newWorkingDay: null,
    },
  });

  const {
    formState: { errors },
    getValues,
    control,
    trigger,
  } = form;

  const sortedData =
    workingDays && Array.isArray(workingDays) ? [...workingDays].sort((a, b) => a.weekDayNumber - b.weekDayNumber) : [];

  const notSelectedDaysDictionary =
    workDaysDictionary?.data.filter((day: IWorkingDay) => {
      return !workingDays.some((userDay: Record<string, any>) => userDay.weekDayNumber == day.value);
    }) ?? [];

  const handleCreateClick = async (callback: Dispatch<SetStateAction<boolean>>) => {
    const formValues = getValues("newWorkingDay");
    if (formValues) {
      const { startWorkingDay, endWorkingDay, weekDayNumber } = formValues;
      if (weekDayNumber && startWorkingDay && endWorkingDay) {
        const notaryId = profileData?.activeCompany?.id;
        const startTime =
          startWorkingDay && isValid(new Date(startWorkingDay)) ? format(new Date(startWorkingDay), "HH:mm:ss") : null;
        const endTime =
          endWorkingDay && isValid(new Date(endWorkingDay)) ? format(new Date(endWorkingDay), "HH:mm:ss") : null;

        const params = {
          weekDayNumber: weekDayNumber,
          endWorkingDay: endTime,
          startWorkingDay: startTime,
          notaryId: notaryId,
        };
        await createWorkingDay("/api/profile/working-day/create", {
          body: params,
        });
        callback(false);
        setIsModalOpen(false);
        refreshData();
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Typography
          sx={{
            color: "#687C9B",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          {t("Working days")}
        </Typography>
        <Button
          component="label"
          sx={{ width: { xs: "100%", sm: "300px" } }}
          color="success"
          startIcon={<AddIcon />}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "14px", sm: "16px" },
              fontWeight: "600",
            }}
          >
            {t("Add a working day")}
          </Typography>
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          gap: "50px",
        }}
      >
        <WorkMode form={profileForm} names={names} />
      </Box>

      <GridTable
        columns={[
          {
            field: "weekDayNumber",
            headerName: "Day of the week",
            width: 250,
            sortable: false,
            valueGetter: (params: GridValueGetterParams) => {
              if (workDaysDictionary?.data && Array.isArray(workDaysDictionary?.data)) {
                const matchingTitle = workDaysDictionary?.data.find(
                  (obj: IWorkingDay) => obj?.order_seq === params.row.weekDayNumber - 1
                );
                const translatedTitle = matchingTitle?.["title_" + locale];
                return translatedTitle;
              }
            },
          },
          {
            field: "startDate",
            headerName: "startWorkingDay",
            width: 250,
            sortable: false,
            valueGetter: (params: GridValueGetterParams) => {
              const startDate = params?.row?.startDate ? params?.row?.startDate.slice(0, 5) : "";
              return startDate;
            },
          },
          {
            field: "endDate",
            headerName: "endWorkingDay",
            width: 250,
            sortable: false,
            valueGetter: (params: GridValueGetterParams) => {
              const endDate = params?.row?.endDate ? params?.row?.endDate.slice(0, 5) : "";
              return endDate;
            },
          },
          {
            field: "Actions",
            type: "actions",
            headerName: "",
            width: 100,
            sortable: false,
            renderCell: ({ row }) => (
              <GridTableActionsCell onRefresh={refreshData} dictionary={workDaysDictionary} row={row} form={form} />
            ),
            cellClassName: "actions-pinnable",
          },
        ]}
        rows={sortedData ?? []}
        cellMaxHeight="200px"
        sx={{
          height: "100%",
        }}
        loading={workingDaysLoading || userDataLoading}
        rowHeight={65}
      />

      <ConfirmationModal
        title={"Add a working day"}
        onConfirm={(callback) => handleCreateClick(callback)}
        isHintShown={false}
        isCloseIconShown={true}
        open={isModalOpen}
        confirmButtonType="primary"
        onToggle={() => setIsModalOpen(false)}
        onClose={() => setIsModalOpen(false)}
        slots={{
          body: () => (
            <Box display="flex" flexDirection="row" gap="15px" marginBottom="25px" flexWrap="wrap">
              <Controller
                control={control}
                name={"newWorkingDay.weekDayNumber"}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%" gap="10px">
                    <InputLabel>{t("Choose working day")}</InputLabel>
                    <Autocomplete
                      labelField={getLabelField(workDaysDictionary, locale as string)}
                      type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      options={
                        notSelectedDaysDictionary ? (notSelectedDaysDictionary as Record<string, any>[]) ?? [] : []
                      }
                      textFieldPlaceholder={"---"}
                      value={
                        field.value != null
                          ? (notSelectedDaysDictionary ?? []).find(
                              (item: Record<string, any>) => item?.value == field.value
                            ) ?? null
                          : null
                      }
                      onBlur={field.onBlur}
                      onChange={(event, value) => {
                        field.onChange(value?.value != null ? parseInt(value?.value) : null);
                      }}
                    />
                  </Box>
                )}
              />
              <Controller
                control={control}
                name={"newWorkingDay.startWorkingDay"}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%" gap="10px">
                    <InputLabel>{t("startWorkingDay")}</InputLabel>
                    <TimePicker
                      type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      value={field.value != null ? field.value : null}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      onChange={(value: Date) => {
                        field.onChange(value != null ? value : null);
                        trigger(field.name);
                      }}
                    />
                  </Box>
                )}
              />
              <Controller
                control={control}
                name={"newWorkingDay.endWorkingDay"}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%" gap="10px">
                    <InputLabel>{t("endWorkingDay")}</InputLabel>
                    <TimePicker
                      type={fieldState.error?.message ? "error" : field.value ? "success" : "secondary"}
                      value={field.value != null ? field.value : null}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      onChange={(value: Date) => {
                        field.onChange(value != null ? value : null);
                        trigger(field.name);
                      }}
                    />
                  </Box>
                )}
              />
            </Box>
          ),
        }}
      />
    </Box>
  );
};

export default ProfileWorkingDays;
