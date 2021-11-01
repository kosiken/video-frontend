import User from "./User";

export interface Transaction {
  transactionType: "withdrawal" | "payment";

  amount: number;

  associatedUser: User;
  txnID: string;
  txnFee: number;
  depositBalance: number;createdAt:number;
}


export interface Ticket {
  user: User;
  body: string; createdAt:number; 
  id: string;
  title: string;

}


export interface Message {  id: string;
  user: string;
  body: string;
  messageType:  "admin_to_user" | "user_to_admin";createdAt:number;

}