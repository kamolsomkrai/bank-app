// src/types/customer.ts

export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: "M" | "F" | null;
  address: string;
  occupation: string | null;
  initialDeposit: number;
};
