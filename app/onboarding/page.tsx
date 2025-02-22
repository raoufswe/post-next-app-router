"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProject } from "@/lib/actions/projects";

export default function OnboardingPage() {
  const { toast } = useToast();
  const router = useRouter();

  async function handleAction(formData: FormData) {
    try {
      const data = {
        name: formData.get("name") as string,
        size: formData.get("size") as "small" | "scale",
      };

      await createProject(data);
      router.push("/dashboard");
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong",
      });
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-muted/50">
      <div className="w-full max-w-md space-y-6 bg-card p-6 rounded-xl shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Let&apos;s get you started
          </h1>
          <p className="text-sm text-muted-foreground">
            Create your first project to continue
          </p>
        </div>

        <form action={handleAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name">Project Name</label>
            <Input name="name" placeholder="My Project" />
          </div>

          <div className="space-y-2">
            <label htmlFor="size">Company Size</label>
            <Select name="size" defaultValue="small">
              <SelectTrigger>
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (0-10)</SelectItem>
                <SelectItem value="scale">Scale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Create Project
          </Button>
        </form>
      </div>
    </div>
  );
}
