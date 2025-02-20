"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ErrorFallbackProps {
  error: { message: string };
}

export function ErrorFallback({ error }: ErrorFallbackProps) {
  const router = useRouter();

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center space-y-4 max-w-md">
        <div className="bg-destructive/10 text-destructive rounded-full w-12 h-12 mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold">Unable to load data</h2>
        <p className="text-muted-foreground">{error.message}</p>
        <Button onClick={() => router.refresh()} variant="outline">
          Try again
        </Button>
      </div>
    </div>
  );
}
