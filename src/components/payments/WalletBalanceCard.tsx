import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Eye, EyeOff } from 'lucide-react';
import { cn } from "@/lib/utils";
import Link from 'next/link';

interface WalletBalanceCardProps {
  balance: number;
  currency?: string;
  isLoading?: boolean;
}

export const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({
  balance,
  currency = 'USD',
  isLoading
}) => {
  const [showBalance, setShowBalance] = React.useState(true);

  const formatBalance = (amount: number, curr: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Card className="relative overflow-hidden border-none bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground shadow-2xl">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      <CardContent className="p-8 relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner border border-white/20">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            onClick={() => setShowBalance(!showBalance)}
          >
            {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </Button>
        </div>

        <div className="space-y-2 mb-10">
          <p className="text-sm font-medium text-white/70 uppercase tracking-widest px-1">
            Total Balance
          </p>
          <div className="flex items-center gap-3">
            <h2 className={cn(
              "text-5xl font-extrabold tracking-tight transition-all duration-300",
              showBalance ? "blur-0" : "blur-lg select-none"
            )}>
              {isLoading ? "..." : formatBalance(balance, currency)}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/pay" className="w-full">
            <Button className="w-full h-12 bg-white text-primary hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all font-bold text-base rounded-xl shadow-lg border-none">
              <Plus className="w-5 h-5 mr-2" />
              Deposit
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full h-12 border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all font-bold text-base rounded-xl backdrop-blur-sm shadow-md"
            onClick={() => {/* Withdrawal logic would go here */}}
          >
            <ArrowUpRight className="w-5 h-5 mr-2" />
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
