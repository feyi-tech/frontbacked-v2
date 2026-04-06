import React from 'react';
import { Transaction } from "@/types/payments";
import { StatusBadge } from "./StatusBadge";
import { ArrowUpRight, ArrowDownLeft, FileText, Clock, Wallet } from 'lucide-react';
import { cn } from "@/lib/utils";

interface TransactionItemProps {
  transaction: Transaction;
  className?: string;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  className
}) => {
  const isCredit = transaction.type === 'credit' || transaction.type === 'deposit';

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'deposit':
      case 'credit':
        return <ArrowDownLeft className="w-5 h-5 text-green-500" />;
      case 'withdrawal':
      case 'debit':
        return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'payment':
        return <Wallet className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      signDisplay: 'always'
    }).format(isCredit ? amount : -amount);
  };

  return (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/30 transition-all border border-transparent hover:border-muted-foreground/10 group",
      className
    )}>
      <div className={cn(
        "p-3 rounded-xl bg-muted/50 transition-colors group-hover:bg-white dark:group-hover:bg-slate-800 shadow-sm",
        isCredit ? "bg-green-500/5 text-green-500" : "bg-red-500/5 text-red-500"
      )}>
        {getIcon(transaction.type)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1 gap-2">
          <h4 className="font-semibold text-sm truncate uppercase tracking-tight text-foreground">
            {transaction.purpose || transaction.type.replace('_', ' ')}
          </h4>
          <span className={cn(
            "font-bold text-sm tabular-nums tracking-tight",
            isCredit ? "text-green-500" : "text-foreground"
          )}>
            {formatAmount(transaction.amount, transaction.currency)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(transaction.createdAt)}</span>
          </div>
          <StatusBadge status={transaction.status} className="scale-75 origin-right" />
        </div>

        {transaction.reference && (
          <div className="mt-2 text-[10px] text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded-md w-fit">
            REF: {transaction.reference}
          </div>
        )}
      </div>
    </div>
  );
};
