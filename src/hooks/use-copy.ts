import { useState, useCallback } from "react";
import { toast } from "sonner";
import { copyToClipboard } from "../utils";

type UseCopyOptions = {
  successMessage?: string;
  errorMessage?: string;
  resetAfterMs?: number;
};

export const useCopy = (options?: UseCopyOptions) => {
  const {
    successMessage = "Copied to clipboard!",
    errorMessage = "Failed to copy. Please copy manually.",
    resetAfterMs = 2000,
  } = options || {};

  const [isCopying, setIsCopying] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    if (isCopying) return; // prevent spam clicks

    setIsCopying(true);

    try {
      await copyToClipboard(text);

      setCopied(true);
      toast.success(successMessage);

      if (resetAfterMs) {
        setTimeout(() => setCopied(false), resetAfterMs);
      }
    } catch (err) {
      toast.error(errorMessage);
      setCopied(false);
    } finally {
      setIsCopying(false);
    }
  }, [isCopying, successMessage, errorMessage, resetAfterMs]);

  return {
    copy,
    copied,
    isCopying,
  };
};