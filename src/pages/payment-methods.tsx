import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { paymentsApi } from '@/api/payments';
import { RechargeableMethodResponse } from '@/types/payments';
import { CreditCard, ShieldCheck, Sparkles, AlertCircle, Loader2, Plus, ArrowRight, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";

const PaymentMethodsPage = () => {
  const [data, setData] = useState<RechargeableMethodResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMethod = async () => {
      setLoading(true);
      try {
        const res = await paymentsApi.getRechargeableMethod();
        setData(res);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load payment methods",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMethod();
  }, []);

  const handleEnableAutoPay = () => {
    if (data?.enableUrl) {
      window.open(data.enableUrl, '_blank');
    }
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-12 pb-20 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight">Payment Methods</h1>
            <p className="text-muted-foreground text-lg">Manage your saved cards and automated payment settings.</p>
          </div>
          <div className="flex items-center gap-3 bg-primary/5 p-3 rounded-2xl border border-primary/10">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">PCI DSS Compliant Security</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground font-medium animate-pulse">Loading payment methods...</p>
          </div>
        ) : data?.exists && data.method ? (
          <div className="grid md:grid-cols-5 gap-10 items-start">
            <div className="md:col-span-3 space-y-6">
              <h2 className="text-2xl font-bold px-1">Saved Methods</h2>
              <Card className="border-none shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden rounded-[2rem] group">
                <div className="absolute top-0 right-0 p-8">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                </div>
                <CardContent className="p-10 pt-20 space-y-12">
                  <div className="space-y-6">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500">Card Number</p>
                    <h3 className="text-3xl font-mono font-black tracking-[0.2em] flex gap-4">
                      <span>••••</span>
                      <span>••••</span>
                      <span>••••</span>
                      <span className="text-primary">{data.method.last4}</span>
                    </h3>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Card Type</p>
                      <p className="text-xl font-bold uppercase tracking-tight">{data.method.brand}</p>
                    </div>
                    <div className="space-y-2 text-right">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Status</p>
                      <div className="flex items-center gap-2 text-green-400 font-bold">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        ACTIVE
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 px-2">
                <Button variant="destructive" className="h-12 px-6 rounded-xl font-bold shadow-lg gap-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-none transition-all">
                  <Trash2 className="w-5 h-5" />
                  Remove Card
                </Button>
                <Button variant="outline" className="h-12 px-6 rounded-xl font-bold border-2 gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Set as Default
                </Button>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 space-y-6">
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Auto-Recharge
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your primary payment method is currently set up for automated billing. This ensures your sites remain active without interruption.
                </p>
                <div className="pt-4 border-t border-primary/10">
                  <Button variant="link" className="p-0 h-auto font-bold text-primary flex items-center gap-2">
                    Manage Billing Cycle
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-12 py-12">
            <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-xl overflow-hidden rounded-[2rem]">
              <div className="h-2 bg-primary" />
              <CardContent className="p-16 text-center space-y-8">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto border-4 border-primary/5">
                  <CreditCard className="w-12 h-12 text-primary" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-extrabold tracking-tight">No Payment Method Linked</h2>
                  <p className="text-muted-foreground text-lg max-w-sm mx-auto leading-relaxed">
                    Link your card securely to enable automatic renewals and one-click payments.
                  </p>
                </div>
                <Button
                  onClick={handleEnableAutoPay}
                  className="h-14 px-10 rounded-2xl text-lg font-bold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                  disabled={!data?.enableUrl}
                >
                  <Plus className="w-6 h-6 mr-2" />
                  Enable Auto Payments
                </Button>
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-6 bg-muted/50 rounded-2xl border border-muted-foreground/10 flex items-start gap-4">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Secure Data</h4>
                  <p className="text-xs text-muted-foreground">We never store your full card details on our servers.</p>
                </div>
              </div>
              <div className="p-6 bg-muted/50 rounded-2xl border border-muted-foreground/10 flex items-start gap-4">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Easy Management</h4>
                  <p className="text-xs text-muted-foreground">Add or remove payment methods at any time with ease.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default PaymentMethodsPage;
