import User from "./User";

export interface Transaction {
  transactionType: "withdrawal" | "payment";

  amount: number;

  associatedUser: User;
  txnID: string;
  txnFee: number;
  depositBalance: number;
}
