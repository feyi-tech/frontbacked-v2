import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/PageContainer';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, Loader2, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { paymentsApi } from '@/api/payments';

const PaymentStatusPage = () => {
  const router = useRouter();
  const { status, reference, tx_ref, transaction_id } = router.query;
  const [currentStatus, setCurrentStatus] = useState<'success' | 'failed' | 'pending' | 'loading'>('loading');
  const [ref, setRef] = useState<string>('');

  const fetchStatus = async (transactionRef: string) => {
    try {
      const res = await paymentsApi.getTransaction(transactionRef);
      if (res.status === 'success' || res.status === 'completed') {
        setCurrentStatus('success');
        return true;
      } else if (res.status === 'failed') {
        setCurrentStatus('failed');
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error polling status:", error);
      return false;
    }
  };

  useEffect(() => {
    if (router.isReady) {
      const s = (status as string || '').toLowerCase();
      const finalRef = (reference || tx_ref || transaction_id || '') as string;
      setRef(finalRef);

      if (s === 'success' || s === 'completed' || s === 'successful') {
        setCurrentStatus('success');
      } else if (s === 'failed' || s === 'cancelled' || s === 'error') {
        setCurrentStatus('failed');
      } else {
        setCurrentStatus('pending');

        // Start polling if pending and we have a reference
        if (finalRef) {
          const interval = setInterval(async () => {
            const finished = await fetchStatus(finalRef);
            if (finished) clearInterval(interval);
          }, 3000);

          return () => clearInterval(interval);
        }
      }
    }
  }, [router.isReady, status, reference, tx_ref, transaction_id]);

  const renderContent = () => {
    switch (currentStatus) {
      case 'success':
        return (
          <div className="space-y-8 text-center animate-in zoom-in-95 duration-500">
            <div className="mx-auto w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center border-4 border-green-500/20">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight">Payment Successful!</h1>
              <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                Your payment has been processed successfully. Your account has been credited.
              </p>
            </div>
            {ref && (
              <div className="p-4 bg-muted/50 rounded-2xl border border-muted-foreground/10 w-fit mx-auto font-mono text-sm">
                <span className="text-muted-foreground mr-2">Reference:</span>
                <span className="font-bold">{ref}</span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button className="w-full h-12 px-8 rounded-xl font-bold shadow-lg">
                  <LayoutDashboard className="w-5 h-5 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/wallet" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full h-12 px-8 rounded-xl font-bold border-2">
                  View Wallet
                </Button>
              </Link>
            </div>
          </div>
        );
      case 'failed':
        return (
          <div className="space-y-8 text-center animate-in zoom-in-95 duration-500">
            <div className="mx-auto w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border-4 border-red-500/20">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight">Payment Failed</h1>
              <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                Unfortunately, your payment could not be processed at this time.
              </p>
            </div>
            <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10 w-fit mx-auto text-sm text-red-600 font-medium">
              Possible reason: Insufficient funds or card declined.
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/pay" className="w-full sm:w-auto">
                <Button className="w-full h-12 px-8 rounded-xl font-bold shadow-lg">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Try Again
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full h-12 px-8 rounded-xl font-bold border-2">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        );
      case 'pending':
        return (
          <div className="space-y-8 text-center animate-in zoom-in-95 duration-500">
            <div className="mx-auto w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center border-4 border-yellow-500/20">
              <Clock className="w-12 h-12 text-yellow-500 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-yellow-700">Payment Pending</h1>
              <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                We're waiting for confirmation from your bank. This may take a few minutes.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 bg-yellow-500/5 p-4 rounded-2xl border border-yellow-500/10 w-fit mx-auto">
              <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />
              <span className="text-sm font-semibold text-yellow-700">Polling for update...</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/wallet" className="w-full sm:w-auto">
                <Button className="w-full h-12 px-8 rounded-xl font-bold shadow-lg">
                  Check Wallet Later
                </Button>
              </Link>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground font-medium">Verifying payment status...</p>
          </div>
        );
    }
  };

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card className={cn(
          "border-none shadow-2xl overflow-hidden backdrop-blur-xl bg-card/50",
          currentStatus === 'success' ? 'bg-green-500/5' : currentStatus === 'failed' ? 'bg-red-500/5' : 'bg-card/50'
        )}>
          <div className={cn(
            "h-2",
            currentStatus === 'success' ? 'bg-green-500' : currentStatus === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
          )} />
          <CardContent className="p-12">
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default PaymentStatusPage;
