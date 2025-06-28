import { UserProfile } from "./user.interface";

export interface Transaction {
  _id: string;
  type: "purchase" | "payment" | string;
  customer: {
    customerId?: string;
    name?: string;
    _id?: string;
  };
  items: TransactionItem[];
  paidInFull: boolean | "no" | "yes";
  paid: number;
  issuedTime: string;
  __v: number;
  totalQuantity: number;
  purchaseAmount: number;
  itemsVariety: number;
  createdBy?: string;
  createdAt?: string;
  contract?: boolean | "no" | "yes";
  issuedBy?: Partial<UserProfile>;
}

export interface TransactionItem {
  productId: string;
  quantity: number;
  _id: string;
  productName?: string;
  priceThen: number;
  code?: string;
  unit:string;
}
