import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { paymentsApi } from '@/api/payments';
import { WalletInfo, Transaction } from '@/types/payments';
import { WalletBalanceCard } from '@/components/payments/WalletBalanceCard';
import { TransactionItem } from '@/components/payments/TransactionItem';
import { Pagination } from '@/components/Pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Loader2, History, TrendingUp, Sparkles, AlertCircle, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

const WalletPage = () => {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransLoading, setIsTransLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchWallet = async () => {
      setIsLoading(true);
      try {
        const walletRes = await paymentsApi.getWallet();
        setWallet(walletRes);
      } catch (error: any) {
        toast({
          title: "Error fetching wallet balance",
          description: error.message || "Failed to load wallet information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchWallet();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsTransLoading(true);
      try {
        const transRes = await paymentsApi.getTransactions({
          page: currentPage,
          per_page: 5,
          status: statusFilter !== 'all' ? statusFilter : undefined
        });
        setTransactions(transRes.transactions);
        setTotalPages(transRes.totalPages);
      } catch (error: any) {
        toast({
          title: "Error fetching wallet data",
          description: error.message || "Failed to load wallet information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [currentPage, statusFilter]);

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto space-y-12 pb-20 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight">Your Wallet</h1>
            <p className="text-muted-foreground text-lg">Manage your funds and track your recent transactions.</p>
          </div>
          <div className="flex items-center gap-3 bg-primary/5 p-3 rounded-2xl border border-primary/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-semibold text-primary">Live Wallet Updates Active</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-10">
            <WalletBalanceCard
              balance={wallet?.balance || 0}
              currency={wallet?.currency}
              isLoading={isLoading}
            />

            <Card className="border-none shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  Quick Stats
                </CardTitle>
                <CardDescription className="text-slate-400">Your financial summary for this month.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Inbound</p>
                  <p className="text-2xl font-black text-green-400">$0.00</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Outbound</p>
                  <p className="text-2xl font-black text-red-400">$0.00</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <History className="w-6 h-6 text-primary" />
                Transactions
              </h2>
              <div className="flex items-center gap-4">
                <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
                  <SelectTrigger className="h-10 rounded-xl border-2 bg-background/50 w-32 text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Link href="/transactions">
                  <Button variant="link" className="font-bold text-primary hover:text-primary/80 flex items-center gap-1 p-0 h-auto">
                    Full History
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {isTransLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-full h-24 bg-muted animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : transactions.length > 0 ? (
              <>
                <div className="bg-card/50 backdrop-blur-xl border border-muted-foreground/10 rounded-3xl p-4 shadow-xl space-y-2">
                  {transactions.map((tx) => (
                    <TransactionItem key={tx.id} transaction={tx} />
                  ))}
                </div>
                <div className="px-2">
                  <Pagination
                    page={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </>
            ) : (
              <Card className="border-dashed border-2 bg-muted/30 p-20 text-center rounded-3xl">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <h3 className="font-bold text-xl mb-2">No Transactions Yet</h3>
                <p className="text-muted-foreground max-w-xs mx-auto mb-8">
                  Your transaction history is empty. Start by funding your wallet.
                </p>
                <Link href="/pay">
                  <Button className="h-12 px-8 rounded-xl font-bold shadow-lg">
                    Add Funds Now
                  </Button>
                </Link>
              </Card>
            )}

            <div className="p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex items-start gap-4">
              <div className="p-2 rounded-xl bg-yellow-500/10 text-yellow-600">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-yellow-700">Withdrawal Note</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Withdrawals are typically processed within 24-48 business hours. Ensure your KYC verification is complete to avoid delays.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default WalletPage;
