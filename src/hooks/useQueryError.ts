import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function useQueryError() {
  const router = useRouter();
  const { error } = router.query;

  const shown = useRef(false);

  useEffect(() => {
    if (!router.isReady) return;

    if (error && !shown.current) {
      shown.current = true;

      toast.error(error);

      // remove error from url so it doesn't trigger again
      const { error: _, ...rest } = router.query;

      router.replace(
        { pathname: router.pathname, query: rest },
        undefined,
        { shallow: true }
      );
    }
  }, [error, router.isReady]);
}