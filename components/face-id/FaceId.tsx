import { Dispatch, FC, SetStateAction } from "react";
import useFetch from "@/hooks/useFetch";
import { useLocale } from "next-intl";
import Webcam from "@/components/ui/Webcam";

interface IFaceIdScannerProps {
  getStatus: (status: boolean) => void;
}

const FaceIdScanner: FC<IFaceIdScannerProps> = ({ getStatus }) => {
  const locale = useLocale();

  const { data, update, loading } = useFetch("", "POST");

  const handleDownload = async (
    recordedChunks: BlobPart[],
    setAlertOpen: Dispatch<SetStateAction<boolean>>,
    setChunks: Dispatch<SetStateAction<BlobPart[]>>
  ) => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const formData = new FormData();
      formData.append("file", blob);
      await update("/api/face-id", formData).then((res) => {
        if (!res?.data?.success) {
          setAlertOpen(true);
        }
        getStatus(res?.data?.success);
      });
      setChunks([]);
    }
  };

  return (
    <>
      <Webcam
        audio={false}
        loading={loading}
        alertText={data?.data[`message_${locale}`]}
        slots={{
          body: () => <></>,
          footer: () => <></>,
        }}
        onStop={({ chunks, setAlert, setChunks }) => handleDownload(chunks, setAlert, setChunks)}
      />
    </>
  );
};

export default FaceIdScanner;
