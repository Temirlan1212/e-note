export default function useConvert() {
  const convert = {
    binary: {
      toArrayBuffer(binary: string) {
        return Uint8Array.from(binary, (s) => s.charCodeAt(0)).buffer;
      },
      toBlob(binary: string, mimeType: string) {
        return new Blob([binary], { type: mimeType });
      },
      toBase64: (binary: string) => btoa(binary),
    },
    arrayBuffer: {
      toBinary(ab: ArrayBuffer) {
        return String.fromCharCode(...(new Uint8Array(ab) as any));
      },
      toBlob(ab: ArrayBuffer, mimeType: string) {
        return new Blob([ab], { type: mimeType });
      },
      toBase64(ab: ArrayBuffer) {
        return btoa(this.toBinary(ab));
      },
    },
    blob: {
      _readAsync(blob: Blob, mode: string) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader() as any;
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader[mode](blob);
        });
      },
      toBinaryAsync(blob: Blob) {
        return this._readAsync(blob, "readAsBinaryString");
      },
      toArrayBufferAsync(blob: Blob) {
        return this._readAsync(blob, "readAsArrayBuffer");
      },
      toBase64Async(blob: Blob) {
        return this._readAsync(blob, "readAsDataURL").then((dataUri: any) => dataUri.replace(/data:[^;]+;base64,/, ""));
      },
    },
    base64: {
      toBinary: (b64: string) => atob(b64),
      toArrayBuffer: (b64: string) => convert.binary.toArrayBuffer(atob(b64)),
      toBlob: (b64: string, mimeType: string) => convert.binary.toBlob(atob(b64), mimeType),
    },
  };

  return convert;
}
