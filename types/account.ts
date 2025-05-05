// src/types/account.ts

export type Account = {
  id: string;
  accountNumber: string;
  balance: number;
  accountType: "SAVINGS" | "CURRENT";
  status: "ACTIVE" | "CLOSED" | "SUSPENDED";
  openedAt: string;
  updatedAt: string;
  customerId: string;
};
