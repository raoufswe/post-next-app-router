"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { createInvitation } from "@/lib/actions/invitations";
import { UserPlus } from "lucide-react";

function InviteForm() {
  const { toast } = useToast();

  async function onSubmit(formData: FormData) {
    const result = await createInvitation(formData);

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Invitation sent successfully",
      });
    }
  }

  return (
    <form action={onSubmit} className="flex flex-col gap-6 py-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="email">Email address</label>
          <Input
            id="email"
            type="email"
            name="emailAddress"
            placeholder="Enter email address"
            required
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="role">Role</label>
          <Select name="role" required>
            <SelectTrigger id="role">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit">Send Invitation</Button>
    </form>
  );
}

export function InviteUserDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite New User</DialogTitle>
        </DialogHeader>
        <InviteForm />
      </DialogContent>
    </Dialog>
  );
}
