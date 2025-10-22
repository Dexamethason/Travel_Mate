export interface SplitParticipant {
  participantId: string;
  amount: number;
}

export interface Expense {
  id?: string;
  tripId: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  splitWith: SplitParticipant[];
  createdAt?: Date | any;
}

export interface CreateExpenseData {
  tripId: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  splitWith: SplitParticipant[];
}

export interface UpdateExpenseData {
  date?: string;
  category?: string;
  description?: string;
  amount?: number;
  splitWith?: SplitParticipant[];
}
