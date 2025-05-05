// src/types/user.ts

export type User = {
  id: string;
  username: string;
  role: "TELLER" | "LOAN_OFFICER" | "MANAGER" | "ADMIN";
  first_name: string;
  last_name: string;
};
