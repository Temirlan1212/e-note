import useEffectOnce from "@/hooks/useEffectOnce";
import useFetch from "@/hooks/useFetch";
import { IApplicationSchema } from "@/validator-schemas/application";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import UploadFiles from "./UploadFiles";
import { CircularProgress } from "@mui/material";

export interface IAttachedFilesProps {
  form: UseFormReturn<IApplicationSchema>;
  name: "requester" | "members";
  index: number;
}

export interface IAttachedFilesMethodsProps {
  next: () => Promise<void>;
  tabChange: (index: number) => Promise<void>;
}

const AttachedFiles: React.ForwardRefRenderFunction<IAttachedFilesMethodsProps, IAttachedFilesProps> = (props, ref) => {
  const { form, name, index } = props;
  const { setValue, getValues } = form;
  const filesIdRef = useRef<null | number[][]>(null);
  const filesRef = useRef<null | Record<number, any>>(null);
  const blobsRef = useRef<null | Record<number, any>>(null);
  const tabActivatedIndexesRef = useRef<null | number[]>([0]);

  const { update: uploadUpdate } = useFetch("", "POST");
  const { update: attachmentsUpdate } = useFetch("", "PUT");
  const { loading: attachmentsLoading, update: getAttachments } = useFetch("", "GET");
  const { loading: filesLoading, update: getFiles } = useFetch("", "POST");
  const { update: deleteUpdate } = useFetch<Response>("", "DELETE");
  const { loading: downloadLoading, update: downloadUpdate } = useFetch<Response>("", "GET", {
    returnResponse: true,
  });

  const deleteFiles = async () => {
    const filesId = filesIdRef.current;
    const statuses: number[] = [];

    tabActivatedIndexesRef.current?.map((index) => {
      if (filesId != null && filesId?.length > 0) {
        filesId?.[index]?.map(async (id) => {
          const res = await deleteUpdate(`/api/files/delete/${id}`);
          statuses.push(res?.status ?? -1);
        });
      }
    });

    if (statuses.every((item) => item === -1) && statuses.length > 0) return -1;
    return 0;
  };

  const attachFiles = async () => {
    const values = getValues(name);
    tabActivatedIndexesRef.current?.map(async (index) => {
      const item = values?.[index];
      const filesId: { id: number }[] = [];

      for (const file of item?.files || []) {
        if (file?.file != null) {
          const formData = new FormData();
          formData.append("file", file.file as File);
          const res = await uploadUpdate("/api/files/upload", formData);
          if (res?.id != null) filesId.push({ id: res.id });
        }
      }

      if (item?.id != null && filesId.length > 0) {
        await attachmentsUpdate(`/api/files/attachments/update?model=com.axelor.apps.base.db.Partner&id=${item.id}`, {
          filesId,
        });
      }
    });
  };

  const filesIdFetch = async () => {
    const promises = getValues(name)?.map(async (item) => {
      if (item?.id != null && item?.files != null) {
        const res = await getAttachments(`/api/files/attachments?model=com.axelor.apps.base.db.Partner&id=${item.id}`);

        if (res?.data?.length > 0) {
          const filesId = res.data.map((item: Record<string, any>) => {
            if (item?.id != null) return item.id;
          });
          return filesId.filter((item: number | undefined) => Boolean(item));
        }
      }
    });

    if (promises != null) {
      const resolvedValues = await Promise.all(promises);
      return resolvedValues.filter((value) => value !== undefined);
    }
  };

  const filesFetch = async (index: number, filesId: number[] | undefined) => {
    if (filesId != null && filesId?.length > 0) {
      if (filesRef.current?.[index] == null) {
        const files = await getFiles(`/api/files`, {
          filters: { id: filesId },
          operator: "in",
        });
        filesRef.current = { ...filesRef.current, [index]: files };
        if (files?.data != null && files?.status !== -1) return files.data;
      }
    }
  };

  const setFilesValue = async (index: number, data: Record<string, any>[] | undefined) => {
    if (data != null) {
      const filesPromiseArray = data.map(async (item: Record<string, any>) => {
        if (item?.id != null && blobsRef.current?.[item?.id] == null) {
          const res = await downloadUpdate(`/api/files/download/${item.id}`);
          const blob = await res.blob();
          blobsRef.current = { [item.id]: blob };

          if (blob != null && item?.fileName != null && item?.fileType != null) {
            const file = new File([blob], item.fileName, {
              type: item.fileType,
            });

            return { file };
          }
        }
      });

      const files = await Promise.all(filesPromiseArray);
      setValue(`${name}.${index}.files`, files?.filter((item) => Boolean(item)) as Record<string, File>[]);
    }
  };

  const handleTabChange = async (index: number) => {
    const id = getValues(name)?.[index]?.id;

    if (id != null) {
      if (filesIdRef.current == null) {
        const res = await filesIdFetch();
        if (res != null && res?.length > 0) filesIdRef.current = res;
      }
      const data = await filesFetch(index, filesIdRef.current?.[index]);
      await setFilesValue(index, data);
    }
  };

  useEffectOnce(() => {
    handleTabChange(0);
  });

  useImperativeHandle(
    ref,
    () => {
      return {
        async next() {
          const status = await deleteFiles();
          if (status === 0) await attachFiles();
        },

        async tabChange(index) {
          await handleTabChange(index);
          if (!tabActivatedIndexesRef.current?.includes(index)) tabActivatedIndexesRef.current?.push(index);
        },
      };
    },
    []
  );

  if (filesLoading || attachmentsLoading || downloadLoading) {
    return <CircularProgress color="success" sx={{ margin: "auto" }} />;
  }

  return <UploadFiles form={form} name={`${name}.${index}.files`} />;
};

export default forwardRef(AttachedFiles);
