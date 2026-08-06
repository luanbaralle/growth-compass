import { useEffect, useState } from "react";

/** Avoid hydration mismatch for client-only scroll animations */
export function useClientMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
