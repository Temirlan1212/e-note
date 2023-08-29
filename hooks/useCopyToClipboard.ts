import { useEffect, useState } from "react";

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<any>;

export default function useCopyToClipboard(params?: { resetDuration: null | number }) {
  const { resetDuration } = params || { resetDuration: null };
  const [copied, setCopied] = useState(false);
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copyToClipboard: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setCopied(true);
    } catch (error) {
      setCopiedText(null);
      setCopied(false);
    }
  };

  useEffect(() => {
    if (copied && resetDuration !== null) {
      const timeoutId = setTimeout(() => {
        setCopied(false);
      }, resetDuration);

      return () => clearTimeout(timeoutId);
    }
  }, [copied, resetDuration]);

  return { copied, copyToClipboard, copiedText };
}
