export interface TransactionItem {
  id: number;
  quantity: number;
}
export interface CreateTransaction {
  coupon?: string;
  voucher?: string;
  points?: boolean;
  transactionItem: TransactionItem[];
}
