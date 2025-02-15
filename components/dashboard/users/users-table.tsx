"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { revokeInvitation } from "@/lib/actions/invitations";

type InvitationStatus = "accepted" | "pending" | "revoked";

interface Invitation {
  id: string;
  emailAddress: string;
  status: InvitationStatus;
  publicMetadata: {
    role?: string;
    isInvited?: boolean;
    invitedBy?: string;
  } | null;
}

const STATUS_STYLES = {
  accepted: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  revoked: "bg-red-100 text-red-800",
} as const;

interface UsersTableProps {
  initialInvitations: Invitation[];
}

export function UsersTable({ initialInvitations }: UsersTableProps) {
  const { toast } = useToast();
  const [invitations, setInvitations] = useState(initialInvitations);

  const handleRevoke = async (invitationId: string) => {
    const result = await revokeInvitation(invitationId);

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      setInvitations(invitations.filter((inv) => inv.id !== invitationId));
      toast({
        title: "Success",
        description: "Invitation revoked successfully",
      });
    }
  };

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
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRevoke(invitation.id)}
                >
                  Revoke
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
