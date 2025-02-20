"use client";

import { ErrorFallback } from "@/components/dashboard/error-fallback";
import { useEffect } from "react";

export default function DashboardError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorFallback error={error} />;
}
