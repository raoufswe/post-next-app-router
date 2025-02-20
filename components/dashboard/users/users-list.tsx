"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { revokeInvitation } from "@/lib/actions/invitations";
import { type Invitation } from "@/types";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Users } from "lucide-react";
import { useFormStatus } from "react-dom";

const STATUS_STYLES = {
  accepted: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  revoked: "bg-red-100 text-red-800",
} as const;

function RevokeButton() {
  const { pending } = useFormStatus();

  return (
    <Button variant="destructive" size="sm" disabled={pending} type="submit">
      {pending ? "Revoking..." : "Revoke"}
    </Button>
  );
}

export function UsersList({ invitations }: { invitations: Invitation[] }) {
  const { toast } = useToast();

  async function handleRevoke(invitationId: string) {
    const result = await revokeInvitation(invitationId);
    if (!result.success) {
      toast({
        title: "Error",
        description: result.error.message,
        variant: "destructive",
      });
    }
  }

  if (!invitations.length) {
    return (
      <EmptyState
        title="No team members"
        description="Invite team members to collaborate on your project."
        icon={Users}
      />
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map((invitation) => (
            <TableRow key={invitation.id}>
              <TableCell>{invitation.emailAddress}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={STATUS_STYLES[invitation.status]}
                >
                  {invitation.status}
                </Badge>
              </TableCell>
              <TableCell>{invitation.publicMetadata?.role}</TableCell>
              <TableCell>
                <form action={() => handleRevoke(invitation.id)}>
                  <RevokeButton />
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
