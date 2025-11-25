export interface Invitation {
  id?: string;
  tripId: string;
  tripName: string;
  invitedEmail: string;
  invitedUserId: string;
  invitedBy: string;
  invitedByName: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface CreateInvitationData {
  tripId: string;
  email: string;
  invitedBy: string;
}

export interface InvitationResponse {
  success: boolean;
  message: string;
  data?: Invitation;
  error?: string;
}

