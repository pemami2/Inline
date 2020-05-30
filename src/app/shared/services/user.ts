export interface User {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
  message?: number;
  tablearray?: {
    name: string;
    phone: number;
    size: number;
    time: number;
    contacted: boolean;
  }[];
}
