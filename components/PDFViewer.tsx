import { FC } from "react";

import { Viewer, Worker } from "@react-pdf-viewer/core";

import "@react-pdf-viewer/core/lib/styles/index.css";

type IPDFViewerProps = {
  fileUrl: string;
};

const PDFViewer: FC<IPDFViewerProps> = ({ fileUrl }) => {
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <Viewer fileUrl={fileUrl} />
    </Worker>
  );
};

export default PDFViewer;
