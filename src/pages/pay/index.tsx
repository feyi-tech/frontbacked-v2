import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { paymentsApi } from '@/api/payments';
import { PaymentMethod, PaymentInitResponse } from '@/types/payments';
import { PaymentMethodCard } from '@/components/payments/PaymentMethodCard';
import { PaymentInstructionPanel } from '@/components/payments/PaymentInstructionPanel';
import { Loader2, ArrowLeft, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/router';

const PayPage = () => {
  const router = useRouter();
  const { amount: queryAmount, currency: queryCurrency, purpose: queryPurpose } = router.query;

  const [amount, setAmount] = useState<string>(queryAmount as string || '');
  const [currency, setCurrency] = useState<string>(queryCurrency as string || 'USD');
  const [purpose, setPurpose] = useState<string>(queryPurpose as string || '');
  const [isLoading, setIsLoading] = useState(false);
  const [initResponse, setInitResponse] = useState<PaymentInitResponse | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  useEffect(() => {
    if (queryAmount) setAmount(queryAmount as string);
    if (queryCurrency) setCurrency(queryCurrency as string);
    if (queryPurpose) setPurpose(queryPurpose as string);
  }, [queryAmount, queryCurrency, queryPurpose]);

  const handleInit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await paymentsApi.init({
        amount: parseFloat(amount),
        currency,
        purpose: purpose || undefined
      });
      setInitResponse(res);
      toast({
        title: "Payment initialized",
        description: "Please select your preferred payment method.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to initialize payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };

  const getCurrencySymbol = (curr: string) => {
    switch (curr) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'NGN': return '₦';
      default: return '$';
    }
  };

  const groupedMethods = initResponse?.methods.reduce((acc, method) => {
    const type = method.type.toLowerCase().includes('card') ? 'Cards' :
                 method.type.toLowerCase().includes('bank') ? 'Bank Transfer' : 'Other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(method);
    return acc;
  }, {} as Record<string, PaymentMethod[]>);

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-12 pb-20">
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => initResponse ? setInitResponse(null) : router.back()}
            className="group -ml-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {initResponse ? "Change amount" : "Back"}
          </Button>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <CreditCard className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">Make a Payment</h1>
              <p className="text-muted-foreground text-lg">Securely fund your account or pay for services.</p>
            </div>
          </div>
        </div>

        {!initResponse ? (
          <div className="grid md:grid-cols-5 gap-12 items-start">
            <Card className="md:col-span-3 border-none shadow-2xl overflow-hidden bg-card/50 backdrop-blur-xl">
              <div className="h-1.5 bg-primary" />
              <CardHeader className="p-8">
                <CardTitle className="text-2xl">Payment Details</CardTitle>
                <CardDescription>Enter the amount you wish to pay.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <form onSubmit={handleInit} className="space-y-8">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-1 space-y-2.5">
                      <Label className="text-xs font-bold uppercase tracking-widest pl-1 opacity-70">Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="h-14 rounded-2xl border-2 focus:ring-primary/20 bg-background/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="NGN">NGN (₦)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2 space-y-2.5">
                      <Label className="text-xs font-bold uppercase tracking-widest pl-1 opacity-70">Amount</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-xl text-muted-foreground">
                          {getCurrencySymbol(currency)}
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="h-14 pl-10 text-2xl font-bold rounded-2xl border-2 focus-visible:ring-primary/20 bg-background/50"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold uppercase tracking-widest pl-1 opacity-70">Purpose (Optional)</Label>
                    <Input
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      placeholder="e.g. Wallet Top-up, Pro Plan..."
                      className="h-14 px-5 rounded-2xl border-2 focus-visible:ring-primary/20 bg-background/50"
                    />
                  </div>

                  <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all" disabled={isLoading || !amount}>
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Sparkles className="w-6 h-6 mr-2" />}
                    Initialize Payment
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="md:col-span-2 space-y-6">
              <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 space-y-6">
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  Secure Checkout
                </h3>
                <ul className="space-y-4">
                  {[
                    "Encrypted transaction data",
                    "Multiple payment options",
                    "Instant wallet crediting",
                    "24/7 payment support"
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-xs text-center text-muted-foreground px-4">
                By proceeding, you agree to our terms of service and payment policies.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-10">
              <h2 className="text-2xl font-bold px-1">Select Payment Method</h2>
              {groupedMethods && Object.entries(groupedMethods).map(([group, methods]) => (
                <div key={group} className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-1">{group}</h3>
                  <div className="grid gap-4">
                    {methods.map((method) => (
                      <PaymentMethodCard
                        key={method.id}
                        method={method}
                        onSelect={handleMethodSelect}
                        isLoading={isLoading}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky top-24">
              {selectedMethod ? (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <PaymentInstructionPanel
                    method={selectedMethod}
                    paymentId={initResponse.paymentId}
                    expiresAt={initResponse.expiresAt}
                  />
                </div>
              ) : (
                <Card className="border-dashed border-2 bg-muted/30 p-12 text-center h-[400px] flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Sparkles className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">Ready to Pay?</h3>
                  <p className="text-muted-foreground max-w-[240px]">
                    Select a payment method from the list to see instructions and complete your payment.
                  </p>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default PayPage;
