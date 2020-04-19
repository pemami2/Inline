export interface User {
   uid: string;
   email?: string;
   displayName?: string;
   photoURL?: string;
   emailVerified?: boolean;
   PIN?: number;
   tables?: number;
   message?: number;
   tablearray?:{name: string, phone: number, size:number, time:number }[];
}

export interface Details {
   uid: string;
   PIN?: number;
   tables?: number;
   message?: number;
   tablearray?:Array<string | number>;
}
