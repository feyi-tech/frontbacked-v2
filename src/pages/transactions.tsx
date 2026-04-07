import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { paymentsApi } from '@/api/payments';
import { Transaction } from '@/types/payments';
import { StatusBadge } from '@/components/payments/StatusBadge';
import { Pagination } from '@/components/Pagination';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, Calendar, Download, Sparkles, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";
import Meta from '@/components/Meta';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchTransactions = async (page: number, status: string, from: string, to: string, search: string) => {
    setLoading(true);
    try {
      const res = await paymentsApi.getTransactions({
        page,
        per_page: 10,
        status: status !== 'all' ? status : undefined,
        from: from || undefined,
        to: to || undefined,
        search: search || undefined
      });
      setTransactions(res.transactions);
      setTotalPages(res.totalPages);
    } catch (error: any) {
      toast({
        title: "Error fetching transactions",
        description: error.message || "Failed to load transaction history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions(currentPage, statusFilter, dateFrom, dateTo, searchTerm);
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [currentPage, statusFilter, dateFrom, dateTo, searchTerm]);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const formatAmount = (amount: number, currency: string, type: string) => {
    const isCredit = type === 'credit' || type === 'deposit';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      signDisplay: 'always'
    }).format(isCredit ? amount : -amount);
  };

  return (
    <DashboardLayout>
      <Meta title="Transactions" description="Complete history of your financial activities." />
      <div className="max-w-6xl mx-auto space-y-12 pb-20 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground text-lg">Complete history of your financial activities.</p>
          </div>
          <Button variant="outline" className="h-12 px-6 rounded-xl font-bold border-2 gap-2 shadow-sm hover:bg-muted/50 transition-all">
            <Download className="w-5 h-5" />
            Export History
          </Button>
        </div>

        <Card className="border-none shadow-2xl overflow-hidden bg-card/50 backdrop-blur-xl">
          <div className="h-1.5 bg-primary/20" />
          <CardHeader className="p-8 pb-4">
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
              <div className="relative w-full lg:max-w-md group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search by reference or purpose..."
                  className="pl-12 h-12 rounded-xl border-2 focus-visible:ring-primary/20 bg-background/50"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-widest">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="date"
                      className="h-10 w-40 rounded-xl border-2 bg-background/50 text-xs"
                      value={dateFrom}
                      onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                    />
                    <span className="text-muted-foreground text-xs font-bold">TO</span>
                    <Input
                      type="date"
                      className="h-10 w-40 rounded-xl border-2 bg-background/50 text-xs"
                      value={dateTo}
                      onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-widest shrink-0">
                  <Filter className="w-4 h-4" />
                </div>
                <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
                  <SelectTrigger className="h-12 rounded-xl border-2 bg-background/50 w-full lg:w-48">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="success">Successful</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium animate-pulse">Loading transaction data...</p>
              </div>
            ) : transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b bg-muted/30">
                      <TableHead className="py-5 px-8 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Type</TableHead>
                      <TableHead className="py-5 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Purpose & Reference</TableHead>
                      <TableHead className="py-5 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Date</TableHead>
                      <TableHead className="py-5 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Amount</TableHead>
                      <TableHead className="py-5 px-8 font-bold text-muted-foreground uppercase tracking-widest text-[10px] text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id} className="hover:bg-muted/30 transition-colors border-b group">
                        <TableCell className="py-5 px-8">
                          <div className={cn(
                            "p-2.5 rounded-xl w-fit group-hover:scale-110 transition-transform shadow-sm",
                            (tx.type === 'credit' || tx.type === 'deposit') ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                          )}>
                            {(tx.type === 'credit' || tx.type === 'deposit') ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                          </div>
                        </TableCell>
                        <TableCell className="py-5">
                          <div className="space-y-1">
                            <p className="font-bold text-foreground truncate max-w-[200px] uppercase text-sm tracking-tight">
                              {tx.purpose || tx.type.replace('_', ' ')}
                            </p>
                            <p className="text-[10px] font-mono text-muted-foreground tracking-tighter uppercase opacity-70">
                              REF: {tx.reference}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="py-5">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(tx.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell className="py-5">
                          <span className={cn(
                            "font-black tabular-nums tracking-tighter text-lg",
                            (tx.type === 'credit' || tx.type === 'deposit') ? "text-green-500" : "text-foreground"
                          )}>
                            {formatAmount(tx.amount, tx.currency, tx.type)}
                          </span>
                        </TableCell>
                        <TableCell className="py-5 px-8 text-right">
                          <StatusBadge status={tx.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-32 text-center flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-2">
                  <Sparkles className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <h3 className="font-bold text-2xl">No Transactions Found</h3>
                <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  We couldn't find any transactions matching your filters. Try adjusting your search criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={() => { setStatusFilter('all'); setSearchTerm(''); setDateFrom(''); setDateTo(''); }}
                  className="rounded-xl h-12 px-8 font-bold border-2 mt-4"
                >
                  Clear All Filters
                </Button>
              </div>
            )}

            <div className="p-8 border-t bg-muted/10">
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TransactionsPage;
