import { Dispatch, FC, SetStateAction } from "react";
import useFetch from "@/hooks/useFetch";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import Webcam, { Countdown } from "@/components/ui/Webcam";

interface IFaceIdScannerProps {
  getStatus: (status: boolean) => void;
}

const FaceIdScanner: FC<IFaceIdScannerProps> = ({ getStatus }) => {
  const t = useTranslations();

  const { update, loading } = useFetch("", "POST");

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
        slots={{
          body: ({ capturing, start }) => (
            <Button
              endIcon={capturing ? <Countdown seconds={2000 / 1000} /> : null}
              sx={{
                fontSize: { xs: "14px", sm: "16px" },
              }}
              buttonType={capturing ? "danger" : "secondary"}
              onClick={start}
              loading={loading}
              disabled={capturing}
            >
              {!capturing && t("Verify")}
            </Button>
          ),
          footer: () => <></>,
        }}
        onStop={({ chunks, setAlert, setChunks }) => handleDownload(chunks, setAlert, setChunks)}
      />
    </>
  );
};

export default FaceIdScanner;
