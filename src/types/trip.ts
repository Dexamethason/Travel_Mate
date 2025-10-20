export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Trip {
  id?: string;
  name: string;
  budget: number;
  participants: Participant[];
  createdAt?: Date | any;
}

export interface CreateTripData {
  name: string;
  budget: number;
  participants: Participant[];
}

export interface UpdateTripData {
  name?: string;
  budget?: number;
  participants?: Participant[];
}

