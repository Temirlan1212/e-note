import useEffectOnce from "@/hooks/useEffectOnce";
import useFetch from "@/hooks/useFetch";
import { IApplicationSchema } from "@/validator-schemas/application";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import UploadFiles from "./UploadFiles";

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
  const filesIdRef = useRef<null | number[]>(null);

  const { update: uploadUpdate } = useFetch("", "POST");
  const { update: fileAttachmentUpdate } = useFetch("", "PUT");
  const { update: filesAttachmentFetch } = useFetch("", "GET");
  const { update: getDocument } = useFetch("", "POST");
  const { update: deleteUpdate } = useFetch<Response>("", "DELETE");

  const handleDeleteFiles = async () => {
    const filesId = filesIdRef.current;

    const statuses: number[] = [];
    if (filesId != null && filesId?.length > 0) {
      filesId?.map(async (id) => {
        const res = await deleteUpdate(`/api/files/delete/${id}`);
        statuses.push(res?.status ?? -1);
      });
    }

    if (statuses.every((item) => item === -1) && statuses.length > 0) return -1;
    return 0;
  };

  const handleAttachFiles = async () => {
    const values = getValues(name);

    for (let item of values || []) {
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
        await fileAttachmentUpdate(`/api/files/attachment/update?model=com.axelor.apps.base.db.Partner&id=${item.id}`, {
          filesId,
        });
      }
    }
  };

  const handleFilesIdFetch = async () => {
    const promises = getValues(name)?.map(async (item) => {
      if (item?.id != null && item?.files != null) {
        const res = await filesAttachmentFetch(
          `/api/files/attachment?model=com.axelor.apps.base.db.Partner&id=${item.id}`
        );

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

  const handleFilesFetch = async (index: number) => {
    const filesId = await handleFilesIdFetch();
    if (filesId != null && filesId?.length > 0) filesIdRef.current = filesId.flat();

    if (filesId?.[index] != null && filesId?.[index]?.length > 0) {
      const files = await getDocument(`/api/files`, {
        filters: { id: filesId?.[index] },
        operator: "in",
      });

      if (files?.data != null && files?.status !== -1) return files.data;
    }
  };

  const handleAttachedFilesDefaultValue = async (index: number) => {
    const id = getValues(name)?.[index]?.id;

    if (id != null) {
      const data = await handleFilesFetch(index);
      if (data != null) {
        const files = data
          .map((item: Record<string, any>) => {
            const sizeText = item?.["metaFile.sizeText"];
            const sizeInKB = sizeText ? parseFloat(sizeText) : null;
            if (sizeInKB && item?.fileName && item?.fileType) {
              const sizeInBytes = sizeInKB * 1024;
              const blob = new Blob([new ArrayBuffer(sizeInBytes)]);
              const file = new File([blob], item.fileName, {
                type: item.fileType,
              });
              return { file, id: item?.id ?? null };
            }
          })
          .filter((item: File | undefined) => Boolean(item));

        setValue(`${name}.${index}.files`, files);
      }
    }
  };

  useEffectOnce(() => {
    handleAttachedFilesDefaultValue(0);
  });

  useImperativeHandle(
    ref,
    () => {
      return {
        async next() {
          const status = await handleDeleteFiles();
          if (status === 0) await handleAttachFiles();
        },

        async tabChange(index) {
          await handleAttachedFilesDefaultValue(index);
        },
      };
    },
    []
  );

  return <UploadFiles form={form} name={`${name}.${index}.files`} />;
};

export default forwardRef(AttachedFiles);
