export interface Participant {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Trip {
  id?: string;
  name: string;
  budget: number;
  ownerId: string;
  participants: Participant[];
  createdAt?: Date | any;
}

export interface CreateTripData {
  name: string;
  budget: number;
}

export interface UpdateTripData {
  name?: string;
  budget?: number;
  participants?: Participant[];
}
