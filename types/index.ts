export type InvitationStatus = "accepted" | "pending" | "revoked";

export interface Invitation {
  id: string;
  emailAddress: string;
  status: InvitationStatus;
  publicMetadata: {
    role?: string;
    isInvited?: boolean;
    invitedBy?: string;
  } | null;
} 